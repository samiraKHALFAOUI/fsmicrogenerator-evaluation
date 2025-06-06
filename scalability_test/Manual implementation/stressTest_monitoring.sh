#!/bin/bash

# --------------------------------------------------
# 📦 Apache JMeter Installation (if not already installed)
# --------------------------------------------------
JMETER_VERSION=5.5
JMETER_FOLDER=apache-jmeter-$JMETER_VERSION
JMETER_ARCHIVE=$JMETER_FOLDER.tgz
JMETER_URL=https://archive.apache.org/dist/jmeter/binaries/$JMETER_ARCHIVE

if [ ! -d "$JMETER_FOLDER" ]; then
  echo "🔧 Installing Java and JMeter..."

  # Install SDKMAN and Java 17
  curl -s "https://get.sdkman.io" | bash
  source "$HOME/.sdkman/bin/sdkman-init.sh"
  sdk install java 17.0.8-tem
  echo 'export JAVA_HOME=$(dirname $(dirname $(readlink -f $(which java))))' >> ~/.bashrc
  echo 'export PATH=$JAVA_HOME/bin:$PATH' >> ~/.bashrc
  source ~/.bashrc
  java -version

  echo "⬇️  Downloading Apache JMeter $JMETER_VERSION..."
  wget $JMETER_URL
  tar -xzf $JMETER_ARCHIVE
fi

# --------------------------------------------------
# 🗂️ Create test directory
# --------------------------------------------------
mkdir -p jmeter-tests
cd jmeter-tests

# --------------------------------------------------
# 📊 Monitor all running Docker containers
# --------------------------------------------------
MONITOR_FILE="resource_usage_raw.csv"
echo "timestamp,container,cpu,mem" > "$MONITOR_FILE"

echo "🖥️  Starting Docker container monitoring..."
(
  while docker ps --format '{{.Names}}' | grep -q .; do
    timestamp=$(date +%T)
    docker stats --no-stream --format "{{.Name}},{{.CPUPerc}},{{.MemUsage}}" |     awk -v t="$timestamp" -F',' '{print t","$1","$2","$3}' >> "$MONITOR_FILE"
    sleep 2
  done
) &

MONITOR_PID=$!

# --------------------------------------------------
# 🚀 Run JMeter test plan
# --------------------------------------------------
echo "🚀 Running JMeter test (stressTest.jmx)..."
../$JMETER_FOLDER/bin/jmeter -n -t stressTest.jmx -l test_result.jtl

# --------------------------------------------------
# 🛑 Stop monitoring
# --------------------------------------------------
kill $MONITOR_PID
echo "📈 Raw system usage data saved to $MONITOR_FILE"

# --------------------------------------------------
# 📈 Analyze test performance and write summary.csv
# --------------------------------------------------
echo "test,avg_latency_ms,min_latency_ms,max_latency_ms,http_429_errors,error_rate_pct,throughput_req_per_sec" > summary.csv

if [ ! -f test_result.jtl ]; then
  echo "❌ JTL file not found. Exiting."
  exit 1
fi

avg_latency=$(awk -F',' '{sum+=$2; count++} END {if (count > 0) printf("%.2f", sum/count); else print 0}' test_result.jtl)
min_latency=$(awk -F',' 'BEGIN{min=9999999} NR>1 {if($2<min) min=$2} END{print min}' test_result.jtl)
max_latency=$(awk -F',' 'BEGIN{max=0} NR>1 {if($2>max) max=$2} END{print max}' test_result.jtl)
total=$(cat test_result.jtl | wc -l)
errors=$(grep -c 'false' test_result.jtl)
error_rate=$(awk -v e=$errors -v t=$total 'BEGIN {if (t > 0) printf("%.2f", (e/t)*100); else print 0}')
too_many=$(grep -c ',429,' test_result.jtl)
start_time=$(awk -F',' 'NR==2 {print $1}' test_result.jtl)
end_time=$(awk -F',' 'END {print $1}' test_result.jtl)
duration_sec=$(( (end_time - start_time) / 1000 ))
throughput=$(awk -v t=$total -v d=$duration_sec 'BEGIN {if (d > 0) printf("%.2f", t/d); else print 0}')
test_name=$(basename test_result.jtl .jtl)

echo "$test_name,$avg_latency,$min_latency,$max_latency,$too_many,$error_rate,$throughput" >> summary.csv

# --------------------------------------------------
# ✅ Final Console Summary
# --------------------------------------------------
echo "✅ Performance Test Summary:"
echo "  🕐 Avg Latency       : $avg_latency ms"
echo "  📉 Min Latency       : $min_latency ms"
echo "  📈 Max Latency       : $max_latency ms"
echo "  🔒 HTTP 429 Errors   : $too_many"
echo "  ❌ Error Rate        : $error_rate %"
echo "  ⚡ Throughput        : $throughput req/sec"

# --------------------------------------------------
# 📉 Compute average CPU and memory usage per container
# --------------------------------------------------
echo "container,avg_cpu_pct,avg_mem_MB" > container_usage.csv
awk -F',' 'NR > 1 {
  gsub(/%/, "", $3)
  mem = $4
  sub(/MiB.*/, "", mem)
  gsub(/ /, "", mem)
  cpu[$2]+=$3
  memMB[$2]+=(mem)
  count[$2]++
}
END {
  for (c in cpu) {
    printf "%s,%.2f,%.2f\n", c, cpu[c]/count[c], memMB[c]/count[c]
  }
}' "$MONITOR_FILE" >> container_usage.csv

# --------------------------------------------------
# ✅ Final Summary Output
# --------------------------------------------------
echo "✅ Performance Test Summary:"
echo "  📄 summary.csv          → performance metrics"
echo "  📄 container_usage.csv  → average container resource usage"
