# from general_utils import GeneralServices
# from pymongo import MongoClient
# import pyodbc
# from config import load_config





# # The `NoSQLDatabaseOperations` class provides methods to connect to a MongoDB database, close the
# # connection, and access collections within the database.
# class NoSQLDatabaseOperations:
#     def __init__(self, config_data):
#         self.config_data = config_data
#         self.mongo_client = None
#         self.mongo_db_connection = None

#     def connect_to_mongodb(self):
#         host = self.config_data['database']['mongoDb']['host']
#         port = self.config_data['database']['mongoDb']['port']
#         dbName = self.config_data['database']['mongoDb']['dbName']
#         mongo_url = f'mongodb://{host}:{port}'
        
#         try:
#             self.mongo_client = MongoClient(mongo_url)
#             self.mongo_db_connection = self.mongo_client[dbName]
#             return self.mongo_db_connection
#         except Exception as e:
#             print(f"Failed to connect to MongoDB: {e}")
#             return None

#     def close_mongodb_connection(self):
#         if self.mongo_client:
#             self.mongo_client.close()
#             print("MongoDB connection closed")

#     def connect_to_mongo_collection(self, collection):
#         return self.mongo_db_connection[collection]


# # The `SQLDatabaseOperations` class provides methods to connect to a SQL Server, execute queries, and
# # close the connection.
# class SQLDatabaseOperations:
#     def __init__(self, config_data):
#         self.config_data = config_data
#         self.sql_connection = None
#         self.sql_cursor = None
#         self.max_retries = 3  # Number of times to retry the operation

#     def connect_to_sql_server(self):
#         database = self.config_data['database']['sql']['dbName']
#         server = self.config_data['database']['sql']['server']

#         connection_string = (
#             'DRIVER={ODBC Driver 17 for SQL Server};'
#             f'SERVER={server};'
#             f'DATABASE={database};'
#             'Trusted_Connection=yes;'
#         )

#         print(connection_string)

#         try:
#             self.sql_connection = pyodbc.connect(connection_string)
#             self.sql_cursor = self.sql_connection.cursor()
#             print('connection established successfully')
#             return self.sql_connection, self.sql_cursor
#         except Exception as e:
#             print(f"Failed to connect to SQL Server: {e}")
#             return None, None

#     def close_sql_connection(self):
#         if self.sql_cursor:
#             self.sql_cursor.close()
#         if self.sql_connection:
#             self.sql_connection.close()
#             print("SQL Server connection closed")

#     def execute_query(self, query):
#         if not self.sql_cursor:
#             self.connect_to_sql_server()
#         self.sql_cursor.execute(query)
#         return self.sql_cursor.fetchall()


#     def execute_insert_update_query(self, query):
#         if not self.sql_cursor:
#             self.connect_to_sql_server()


#         attempt = 0
#         while attempt < self.max_retries:
#             try:
#                 self.sql_cursor.execute(query)
#                 self.sql_cursor.commit()
#                 print('Record Inserted/Updated\n')
#                 return True
#             except Exception as e:
#                 print(f"Error executing query: {e}")
#                 self.sql_cursor.rollback()
#                 attempt += 1
#                 if attempt < self.max_retries:
#                     print("Retrying operation...")
#                 else:
#                     print("Max retries reached. Operation failed.")
#                     return False


# # The `SqlQueries` class contains a method `get_records` that executes a SQL query to retrieve the top
# # 2 records from a specific table.
# class SqlQueries:
    
#     def __init__(self, db_service):
#         self.db_service = db_service
#         self.general_services = GeneralServices()

#     def get_records(self):
#         query = """
#                     SELECT TOP 1000 *
#                                     FROM CDF_LEDGER_HT_DEC_2023
#                                     where consumer_address like '%KHASRA%'
#                                     or consumer_address like '%PLOT%'
#                                     or consumer_address like '%k.no.%'
#                                     or consumer_address like '%kh.no.%'
#                                     or consumer_address like '%kh no.%'
#                                     or consumer_address like '%kh no%'
#                                     or consumer_address like '%kh. no.%'
#                                     or consumer_address like '%kh. no%'
#                 """
#         # query = '''SELECT TOP 1000 *
#         #             FROM CDF_LEDGER_HT_DEC_2023
#         #             where 
#         #             KNO = 110114023176
#         #         '''
#         results = self.db_service.execute_query(query)
#         return results
    
#     def search_similar_address_query1(self,consumer_name,geo_details):

#         geo_details = [{k: v.lower() if isinstance(v, str) else v for k, v in geo_detail.items()} for geo_detail in geo_details]
#         consumer_name = self.general_services.remove_words_from_name(consumer_name)

#         for geo_detail in geo_details:
#             query = f'''
#                         SELECT KNO,ACCNO,CONSUMER_NAME,CONSUMER_ADDRESS
#                         FROM CDF_LEDGER_HT_DEC_2023
#                         WHERE 
#                         (
#                         CONSUMER_NAME LIKE '% {consumer_name} %' 
#                         OR CONSUMER_NAME LIKE '{consumer_name} %' 
#                         OR CONSUMER_NAME LIKE '% {consumer_name}'
#                         )
#                         AND 
#                         (
#                         CONSUMER_ADDRESS LIKE '%{geo_detail['tehsil_name']}%'
#                         OR 
#                         CONSUMER_ADDRESS LIKE '%{geo_detail['pincode']}%'
#                         OR 
#                         CONSUMER_ADDRESS LIKE '%{geo_detail['place_name']}%'
#                         );                
#                     '''

#             # print(query)
#             results = self.db_service.execute_query(query)
#             return results


#     def search_similar_address_query2(self,consumer_name,geo_details):
#         geo_details = [{k: v.lower() if isinstance(v, str) else v for k, v in geo_detail.items()} for geo_detail in geo_details]
#         consumer_name = self.general_services.remove_words_from_name(consumer_name)

#         for geo_detail in geo_details:
#             query = f'''
#                         SELECT KNO,ACCNO,CONSUMER_NAME,CONSUMER_ADDRESS
#                         FROM CDF_LEDGER_HT_DEC_2023
#                         WHERE 
#                         (
#                         CONSUMER_NAME LIKE '% {consumer_name} %' 
#                         OR CONSUMER_NAME LIKE '{consumer_name} %' 
#                         OR CONSUMER_NAME LIKE '% {consumer_name}'
#                         );                
#                     '''

#             # print(query)
#             results = self.db_service.execute_query(query)
#             return results




# # The class `DatabaseServices` inherits from `NoSQLDatabaseOperations` and `SQLDatabaseOperations`,
# # loads configuration data from `app.config`, and initializes instances of both parent classes using
# # the configuration data.
# class DatabaseServices(NoSQLDatabaseOperations, SQLDatabaseOperations):
#     # Load configuration data
#     config_data = load_config('app.config')

#     def __init__(self):
#         NoSQLDatabaseOperations.__init__(self, self.config_data)
#         SQLDatabaseOperations.__init__(self, self.config_data)


# config_data = load_config('app.config')
# sql = SQLDatabaseOperations(config_data)
# conn,cursor = sql.connect_to_sql_server()
# # import pandas as pd
# # df = pd.read_sql_query('select * from CDF_LEDGER_HT_DEC_2023',con = conn)
# # df.to_excel(r'D:\ajmer\codes\python\actual_data.xlsx',index=False)
# # print(conn)

import requests
from requests.auth import HTTPBasicAuth

# API endpoint
url = "https://collection.bestundertaking.net/DHARAVIBESTSRAAPI/api/v1/BESTSRA/bestconsumerdata"

# Credentials for Basic Auth
username = "BESTDHARAVIRDP"
password = "BeSTxYk6G3@#123"  # Add the password here

# Payload
payload = {
    "AccountNo": "773180189"  # Ensure this is 9 digits
}

# Headers
headers = {
    "Content-Type": "application/json"
}

# Make a POST request
try:
    response = requests.post(
        url,
        json=payload,
        auth=HTTPBasicAuth(username, password),
        headers=headers
    )
    
    # Check the response
    if response.status_code == 200:
        print("Data fetched successfully:")
        print(response.json())  # Print the response data
        print(response)
    else:
        print(f"Failed to fetch data. Status code: {response.status_code}")
        print(response.text)  # Print error details

except Exception as e:
    print(f"An error occurred: {e}")
