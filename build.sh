#!/usr/bin/env bash

set -euxo pipefail

BRANCH=cp7.1.0.219

WORK_DIR=$(mktemp -d -t build-oo.XXXXX)
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
OUT_DIR=$SCRIPT_DIR

copy_git() {
  local SRC_DIR=$1
  local DST_DIR=$2

  mkdir -p "$DST_DIR"
  pushd "$SRC_DIR"
  git -c core.quotepath=off ls-files | xargs -I '{}' cp --parents '{}' "$DST_DIR"
  popd
}

cd "$WORK_DIR"

while [[ $# -gt 0 ]]; do
  case $1 in
    -o|--out)
      OUT_DIR=$2
      shift
      shift
      ;;
    -s|--sdkjs-dir)
      SDKJS_DIR=$2
      shift
      shift
      ;;
    -w|--web-apps-dir)
      WEB_APPS_DIR=$2
      shift
      shift
      ;;
    *)
      echo "Unknown parameter $1"
      exit 1
      ;;
  esac
done

if [ ${SDKJS_DIR+x} ] ; then
  copy_git "$SDKJS_DIR" "$WORK_DIR/sdkjs"
else
  git clone --depth 1 --branch $BRANCH https://github.com/cryptpad/sdkjs
fi

if [ ${WEB_APPS_DIR+x} ] ; then
  copy_git "$WEB_APPS_DIR" "$WORK_DIR/web-apps"
else
  git clone --depth 1 --branch $BRANCH https://github.com/cryptpad/web-apps
fi

cd sdkjs
make

cd "$OUT_DIR"
rm -rf sdkjs web-apps

cp -r \
  "$WORK_DIR/sdkjs/deploy/sdkjs" \
  "$WORK_DIR/sdkjs/deploy/web-apps" \
  "$OUT_DIR"
