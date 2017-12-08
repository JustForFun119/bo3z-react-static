import urllib.request

ncc_google_sheets_url = "https://docs.google.com/spreadsheets/d/1zpMpR7deHB4fQByw45g7mVzTo0iE17lSmDeu66XpXyQ/export?format=csv"
response = urllib.request.urlopen(ncc_google_sheets_url)
data = response.read()
text = data.decode('utf-8')
print(text)
