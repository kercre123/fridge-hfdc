#!/bin/bash

set -e

if [ ! -f /home/pi/fridge-hfdc/fridgeName ]; then
   echo "fridgeName file does not exist"
   exit 0
fi
gridderName=$(cat /home/pi/fridge-hfdc/fridgeName)

while true
do
  if [ -f /home/pi/fridge-hfdc/fridgeOpens.csv ]; then
  curl -T /home/pi/fridge-hfdc/fridgeOpens.csv http://wire.my.to:81/fridge-hfdc/${gridderName}.csv
  echo "Uploaded"
  fi
  sleep 300
done
