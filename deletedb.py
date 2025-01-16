import requests

# Set the URL of the API
url = "http://localhost:5000/fetch_pages"  # Replace <server_ip> with your server's IP address or "localhost" if running locally

payload = {"fromDate" : "01-10-2023",
           "toDate" : "02-11-2023"}

try:
    # Make a GET request to fetch data
    response = requests.get(url, params=payload)

    # Check if the request was successful
    if response.status_code == 200:
        data = response.json()  # Parse JSON response
        print("Data fetched successfully:")
        print(data,len(data))
        # for record in data:
        #     print(record)  # Each record will be a dictionary
    else:
        print(f"Failed to fetch data. Status code: {response.status_code}")
        print("Response:", response.text)

except requests.exceptions.RequestException as e:
    print(f"Error connecting to the API: {e}")

# import requests

# # Set the URL of the API
# url = "http://20.244.31.34:5001/fetch_data"  # Replace <server_ip> with your server's IP address or "localhost" if running locally

# payload = {"fromDate" : "01-11-2024",
#            "toDate" : "18-11-2024"}

# try:
#     # Make a GET request to fetch data
#     response = requests.get(url, params=payload)

#     # Check if the request was successful
#     if response.status_code == 200:
#         data = response.json()  # Parse JSON response
#         print("Data fetched successfully:")
#         print(data,len(data))
#         # for record in data:
#         #     print(record)  # Each record will be a dictionary
#     else:
#         print(f"Failed to fetch data. Status code: {response.status_code}")
#         print("Response:", response.text)

# except requests.exceptions.RequestException as e:
#     print(f"Error connecting to the API: {e}")


# import requests

# # Set the URL of the API
# url = "http://20.244.31.34:5001/fetch_data"  # Replace <server_ip> with your server's IP address or "localhost" if running locally

# try:
#     # Make a GET request to fetch data
#     response = requests.get(url)

#     # Check if the request was successful
#     if response.status_code == 200:
#         data = response.json()  # Parse JSON response
#         print("Data fetched successfully:")
#         for record in data:
#             print(record)  # Each record will be a dictionary
#     else:
#         print(f"Failed to fetch data. Status code: {response.status_code}")
#         print("Response:", response.text)

# except requests.exceptions.RequestException as e:
#     print(f"Error connecting to the API: {e}")
