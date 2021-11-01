
# Reading an excel file using Python
import xlrd
import requests
import time
import json
import datetime


def convert24(str1):

    # Checking if last two elements of time
    # is AM and first two elements are 12
    if str1[-2:] == "AM" and str1[:2] == "12":
        return "00" + str1[2:-2]

    # remove the AM
    elif str1[-2:] == "AM":
        return str1[:-2]

    # Checking if last two elements of time
    # is PM and first two elements are 12
    elif str1[-2:] == "PM" and str1[:2] == "12":
        return str1[:-2]

    else:

        # add 12 to hours and remove PM
        return str(int(str1[:2]) + 12) + str1[2:8]

def decimalToTime(percent):
    seconds = int(86400*percent)
    ourTime = datetime.timedelta(seconds=seconds)
    print(ourTime)
    return str(ourTime)

# Give the location of the file
loc = ("data2_1.xls")

# To open Workbook
wb = xlrd.open_workbook(loc)
sheet = wb.sheet_by_index(0)

# For row 0 and column 0
row = sheet.nrows
counter = 0
start = time.time()
for i in range(1,row):
    curr_value = sheet.row_values(i)
    print(curr_value)


    if '1970' in curr_value[0] or curr_value[0] == '' or curr_value[1]=='_' or str(curr_value[6])[0].isalpha():
        counter+=1
        print(counter, '1970 skipped....' )
        continue
    date = curr_value[0].split('/')[0:3]
    if len(date[2]) == 1:
        date[2] = '0'+date[2]
    if len(date[1]) == 1:
        date[1] = '0'+date[1]
    date = '-'.join(date)


    print(curr_value[1])
    mytime = curr_value[1]

    mytime = decimalToTime(mytime)
    if mytime[1] == ':':
        mytime = '0' + mytime
    mydatetime = date+'T'+mytime+'+05:30'
    print(mydatetime)
    data = {
        "dateTime": mydatetime,
        "deviceID": curr_value[3],
        "sensorID": curr_value[6],
        "sensorType": curr_value[5],
        "deviceType": curr_value[2],
        "noOfSensors":curr_value[4],
        "values":[curr_value[7],curr_value[8],curr_value[9],curr_value[10]]
    }
    headers = {'Content-type': 'application/json', 'x-api-key':"mp1fe67890"}
    r = requests.post('http://localhost:5000/data/', data=json.dumps(data), headers=headers)


    print(r.status_code, i)
    if r.status_code == 400:
        print(json.dumps(str(r.content), indent=2))
        break
print('counter skips', counter)

end = time.time()
print(end - start)
