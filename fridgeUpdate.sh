#!/bin/bash

set -e

cd /home/pi/fridge-hfdc

while true
do
  git pull
  sleep 43200
done
