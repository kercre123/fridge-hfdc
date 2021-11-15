#!/bin/bash

currentDate=$(date +'%m-%d-%Y')

if [[ $1 == "0" ]]; then
   if [ -f fridgeOpens.csv ]; then
      rm fridgeOpens.csv
   fi
   exit 0
fi

if [[ $7 == "false" ]]; then
   exit 0
fi

if [[ $1 == "1" ]]; then
   if [ -f fridgeOpens.csv ]; then
      rm fridgeOpens.csv
   fi
fi

if [ -f fridgeOpens.csv ]; then
   echo $2,$3,$4,$5,$6 >> fridgeOpens.csv
else
   echo -e "Seconds,Date,Time,Temp,Humidity" > fridgeOpens.csv
   echo -e $2,$3,$4,$5,$6 >> fridgeOpens.csv
fi

if [[ $1 == "getToday" ]]; then
   if [ -f fridgeOpenssave ]; then
      cat fridgeOpenssave
   else
      echo "0"
   fi
else
   echo $1 > fridgeOpenssave
fi

