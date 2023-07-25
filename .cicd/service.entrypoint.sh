set -e
set -x

if [ "$CLOUD_SERVICE_PROVIDER" = "AWS" ]; then
  echo check pre orm run
  node pre-orm.js
fi
