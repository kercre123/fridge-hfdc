#!/bin/bash

while true  
do
  if [ -f /home/pi/fridge-hfdc/fridgeOpens.csv ]; then
  curl -T /home/pi/fridge-hfdc/fridgeOpens.csv http://wire.my.to:81/backup/
  echo "Uploaded"
  fi
  sleep 300
done
