#!/usr/bin/env bash

set -euxo pipefail

OO_BRANCH=cp7.3.3.60-api
EDITOR_BRANCH=main  # TODO use version here

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
    -e|--onlyoffice-editor-dir)
      ONLYOFFICE_EDITOR_DIR=$2
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
  git clone --depth 1 --branch $OO_BRANCH https://github.com/cryptpad/sdkjs.git
fi

if [ ${WEB_APPS_DIR+x} ] ; then
  copy_git "$WEB_APPS_DIR" "$WORK_DIR/web-apps"
else
  git clone --depth 1 --branch $OO_BRANCH https://github.com/cryptpad/web-apps.git
fi

if [ ${ONLYOFFICE_EDITOR_DIR+x} ] ; then
  copy_git "$ONLYOFFICE_EDITOR_DIR" "$WORK_DIR/onlyoffice-editor"
else
  git clone --depth 1 --branch "$EDITOR_BRANCH" https://github.com/cryptpad/onlyoffice-editor.git
fi

cd sdkjs
make

cd "$WORK_DIR/onlyoffice-editor"
npm ci
npm run build
mv "$WORK_DIR/sdkjs/deploy/web-apps/apps/api/documents/api.js" "$WORK_DIR/sdkjs/deploy/web-apps/apps/api/documents/api-orig.js"
cp "$WORK_DIR/onlyoffice-editor/dist/api.js" "$WORK_DIR/sdkjs/deploy/web-apps/apps/api/documents/api.js"

cd "$OUT_DIR"
rm -rf sdkjs web-apps

cp -r \
  "$WORK_DIR/sdkjs/deploy/sdkjs" \
  "$WORK_DIR/sdkjs/deploy/web-apps" \
  "$OUT_DIR"

ls "$OUT_DIR/web-apps/apps/api/documents/"
