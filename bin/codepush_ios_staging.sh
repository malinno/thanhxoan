#!/usr/bin/env bash

cd "$(dirname "$0")"
cd ..

VERSION=$1

DEFAULT_DESCRIPTION="Bugs fixed and improvements"
DESCRIPTION=${2:-${DEFAULT_DESCRIPTION}}

appcenter codepush release-react \
-a F99/TranVuThu-iOS \
-d Staging \
--description "$DESCRIPTION" \
-k ./resources/codepush/key/private.pem \
-t "$VERSION"