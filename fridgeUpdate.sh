#!/bin/bash

set -e

cd /home/pi/fridge-hfdc

while true
do
  git pull
  sync
  systemctl restart fridge-hfdc fridge-hfdc-curl
  sleep 43200
done
