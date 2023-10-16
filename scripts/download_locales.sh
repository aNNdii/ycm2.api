#!/bin/bash -e

ENV_FILE=${1:-./config/.env.scripts}

UNZIP_PATH=/usr/bin/unzip
LOCALES_PATH=assets/locales
LOCALES_ZIP_PATH=/tmp/locales.zip

title() {
    echo "--------------------------------------------------------------------------------"
    echo "--- $1"
    echo "--------------------------------------------------------------------------------"
}

if ! [ -x $UNZIP_PATH ]; then 
    title 'Install unzip package'
    sudo apt update
    sudo apt install unzip 
fi

title 'Loading config file....'
source $ENV_FILE

title 'Download translations...'
curl -s "$I18N_API_URL/v2/projects/export?ak=$I18N_API_KEY" --output $LOCALES_ZIP_PATH > /dev/null

title 'Extract translations...'
unzip -o -d $LOCALES_PATH $LOCALES_ZIP_PATH > /dev/null

title 'Remove zip...'
rm $LOCALES_ZIP_PATH > /dev/null

title 'Done.'
