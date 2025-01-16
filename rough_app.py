from flask import Flask, jsonify, request
import psycopg2
import json
from datetime import datetime

app = Flask(__name__)

DB_SETTINGS = {
    "dbname": "postgres",
    "user": "postgres",
    "password": "admin",
    "host": "localhost",
    "port": "5432"
}

def get_db_connection():
    conn = psycopg2.connect(**DB_SETTINGS)
    return conn


@app.route('/fetch_pages', methods=['GET'])

def fetch_data():
    # return 'heelisdfsflkj'

    fromDate = request.args.get('fromDate')
    toDate = request.args.get('toDate')
    print(fromDate,":::",toDate)
    if not fromDate or not toDate:
        # return jsonify({"a" :fromDate})
        return jsonify({"error": "Please provide both 'fromDate',${fromDate} and 'toDate' ${toDate} parameters in 'DD-MM-YYYY' format"}), 400

    # fromDate = datetime.strptime(fromDate,'%d-%b-%Y').strftime('%d-%m-%Y')
    # toDate = datetime.strptime(toDate,'%d-%b-%Y').strftime('%d-%m-%Y')

#    try:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT * FROM report_data
        WHERE TO_DATE(processing_date, 'DD-MM-YYYY') 
        BETWEEN TO_DATE(%s, 'DD-MM-YYYY') AND TO_DATE(%s, 'DD-MM-YYYY');
    """, (fromDate, toDate))

    rows = cursor.fetchall()

    col_names = [desc[0] for desc in cursor.description]
    data = [dict(zip(col_names, row)) for row in rows]

    cursor.execute("""
        SELECT SUM(CAST(pdf_page_count AS BIGINT))
        FROM report_data
        WHERE TO_DATE(processing_date, 'DD-MM-YYYY') 
        BETWEEN TO_DATE(%s, 'DD-MM-YYYY') AND TO_DATE(%s, 'DD-MM-YYYY');
    """, (fromDate, toDate))

    page_count = cursor.fetchone()[0]
    page_count = page_count if page_count else 0
    cursor.close()
    conn.close()
    return jsonify({"data": data, "pageCount": page_count})

#    except Exception as e:
#        return jsonify({"error": str(e)}), 500

# if __name__ == '__main__':
#    print("Flask application running")
#    app.run(host="0.0.0.0", port=5000,debug=True)


# @app.route('/')
# def demo():
#     return jsonify({'key' :'hello world'})

if __name__ == '__main__':
   print("Flask application running")
   app.run(port=5000,debug=True)





# ##### Hero RM
# from flask import Flask, jsonify, request
# import pyodbc
# from datetime import datetime
# import json
# from waitress import serve

# app = Flask(__name__)

# def get_db_connection():
    
#     conn = pyodbc.connect(r"DRIVER={ODBC Driver 11 for SQL Server}; SERVER=HMCISQLDB001P\MSSQL_PROD2014; DATABASE=RPA_DASHBOARD; UID=rapd; PWD=Pey45$#12Hp")
#     # cursor = conn.cursor()
#     return conn

# @app.route('/fetch_data', methods=['GET'])
# def fetch_data():
#     fromDate = request.args.get('fromDate')
#     toDate = request.args.get('toDate')

#     if not fromDate or not toDate:
#         return jsonify({"error": "Please provide both 'fromDate' and 'toDate' parameters in 'DD-MM-YYYY' format"}), 400

#     fromDate = datetime.strptime(fromDate,'%d-%b-%Y').strftime('%d-%m-%Y')
#     toDate = datetime.strptime(toDate,'%d-%b-%Y').strftime('%d-%m-%Y')

#     try:
#         conn = get_db_connection()
#         cursor = conn.cursor()

#         cursor.execute(f"""
#                     SELECT *
#                     FROM 
#                         [RPA_DASHBOARD].[dbo].[rm_monitoring] 
#                     WHERE 
#                         CAST(CAST(end_time AS VARCHAR(MAX)) AS DATETIME) 
#                         BETWEEN '{fromDate} 00:00:00' AND '{toDate} 23:59:59'
#         """)

#         rows = cursor.fetchall()

#         col_names = [desc[0] for desc in cursor.description]
#         data = [dict(zip(col_names, row)) for row in rows]

#         cursor.execute(f"""
#                 SELECT 
#                     SUM(page_count) AS page_count 
#                 FROM (
#                     SELECT DISTINCT 
#                         file_name, 
#                         CAST(page_count AS INT) AS page_count 
#                     FROM 
#                         [RPA_DASHBOARD].[dbo].[rm_monitoring] 
#                     WHERE 
#                         CAST(CAST(end_time AS VARCHAR(MAX)) AS DATETIME) 
#                         BETWEEN '{fromDate} 00:00:00' AND '{toDate} 23:59:59'
#                 ) AS total_count;
#         """)

#         page_count = cursor.fetchone()[0]
#         page_count = page_count if page_count else 0

#         cursor.close()
#         conn.close()

#         return jsonify({"data": data, "pageCount": page_count})

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# if __name__ == '__main__':
#     serve(app ,port=5001, host='0.0.0.0')
#     # app.run(host="0.0.0.0", port=5001)  # Set host to 0.0.0.0 to allow external access
