#!/bin/bash

# Base directory of the project
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Directories to scan for services
BACKEND_DIR="$SCRIPT_DIR/backend"
FRONTEND_DIR="$SCRIPT_DIR/frontend"
GATEWAY_DIR="$SCRIPT_DIR/APIGateway"

# Function to check for package.json and "dev" script
has_dev_script() {
  local folder="$1"
  local pkg="$folder/package.json"
  if [ -f "$pkg" ] && grep -q '"dev"\s*:' "$pkg"; then
    return 0
  else
    return 1
  fi
}

# Launch service in new GNOME terminal tab
launch_service() {
  local name="$1"
  local path="$2"

  echo "📂 Processing '$name'..."
  
  if [ ! -d "$path/node_modules" ]; then
    echo "⏳ Installing dependencies for $name..."
    (cd "$path" && npm install --force)
    if [ $? -ne 0 ]; then
      echo "❌ Failed to install dependencies for $name"
      return
    fi
  fi

  echo "🚀 Launching '$name'..."
  gnome-terminal --tab --title="$name" -- bash -c "cd \"$path\"; trap '' SIGINT; npm run dev; exec bash"
}

# Launch API Gateway
if has_dev_script "$GATEWAY_DIR"; then
  launch_service "APIGateway" "$GATEWAY_DIR"
fi

# Launch backend microservices
for service_dir in "$BACKEND_DIR"/*/; do
  [ -d "$service_dir" ] || continue
  if has_dev_script "$service_dir"; then
    service_name=$(basename "$service_dir")
    launch_service "$service_name" "$service_dir"
  fi
done


# Launch Angular Frontend with custom command
if [ -f "$FRONTEND_DIR/angular.json" ]; then
  echo "📂 Processing 'Frontend'..."
  if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
    echo "⏳ Installing frontend dependencies..."
    (cd "$FRONTEND_DIR" && npm install --force)
    if [ $? -ne 0 ]; then
      echo "❌ Failed to install dependencies for Frontend"
    fi
  fi

  echo "🚀 Launching 'Frontend' (Angular)..."
  gnome-terminal --tab --title="Frontend" -- bash -c "cd \"$FRONTEND_DIR\"; trap '' SIGINT; ng serve --o; exec bash"
fi

echo "✅ All services should now be running in separate tabs."