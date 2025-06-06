# 📈 Scalability Testing – FSMicroGenerator Evaluation

This folder contains automated scalability test scripts and results for evaluating the performance of:

- The FSMicroGenerator-generated inventory management system
- The manually developed reference implementation

Each subfolder includes preconfigured JMeter tests, stress test and monitoring script, and resource usage logs.

---

## 📁 Folder Structure

```

scalability_Test/
├── FSMicroGenerator-based implementation/
│   ├── jmeter-tests/
│   │   └── stressTest.jmx
│   ├── results/
│   │   ├── container_usage.csv
│   │   ├── summary.csv
│   │   ├── jmeter.log
│   │   ├── test_result.jtl
│   │   └── resource_usage_raw.csv
│   └── stressTest_monitoring.sh
├── Manual implementation/
│   ├── jmeter-tests/
│   │   └── stressTest.jmx
│   ├── results/
│   │   ├── container_usage.csv
│   │   ├── summary.csv
│   │   ├── jmeter.log
│   │   ├── test_result.jtl
│   │   └── resource_usage_raw.csv
│   └── stressTest_monitoring.sh

````

---

## 🧪 How to Run a Test

### 1. Start the application

Before running a test, make sure the corresponding application (manual or generated) is up and running.

### 2. Go to the desired test folder

Example for FSMicroGenerator-based implementation:
```bash
cd scalability_Test/FSMicroGenerator-based\ implementation/
````

### 3. Make the script executable

```bash
chmod +x stressTest_monitoring.sh
```

### 4. Run the test

```bash
./stressTest_monitoring.sh
```

This script launches:

* JMeter with a predefined stress scenario
* A monitoring process that captures CPU and memory usage of each container

---

## ⚠️ Configuration Notes

* If needed, update the **API port** or target URLs inside `jmeter-tests/stressTest.jmx`.
* For the **FSMicroGenerator-based version**, update the **authentication token** in the `.jmx`.

---

## 📂 Test Results

Each run generates the following output :

| File                     | Description                                            |
| ------------------------ | -------------------------------------------------------|
| `container_usage.csv`    | Average CPU and memory usage summary for each container|
| `summary.csv`            | Aggregate metrics: throughput, latency, errors         |
| `test_result.jtl`        | Raw JMeter results                                     |
| `jmeter.log`             | JMeter execution log                                   |
| `resource_usage_raw.csv` | Per-second raw resource usage for each container       |

These data files were used to generate the performance analysis and charts included in the article.

---

## 📌 Important

> Results may differ from those presented in the article due to differences in system load or hardware.
> For a fair comparison, always run both implementations **on the same machine under the same conditions**.

*(Note: *Our test results are included in the results/ folders and discussed in the article's result section.* )*
