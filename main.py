from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from datetime import *
from dateutil.relativedelta import *
import calendar
import requests
import jsonpickle
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/')
def home():
    return "Welcome to the Stock Market API"

@app.route('/static/<path:filename>')
def serve(filename):
    return send_from_directory(app.static_folder, filename)

api_keyf=os.getenv('finnhub_apiKey')
api_keyp=os.getenv('polygon_key')
#Getting Company tab data
@app.route('/company/<symbol>', methods=['GET'])
def get_company_details(symbol):
    print("company details")
  
    company_symbol = symbol.upper()
    company_profile = requests.get(f'https://finnhub.io/api/v1/stock/profile2?symbol={company_symbol}&token={api_keyf}')
    return company_profile.json()

@app.route('/summary/<symbol>', methods=['GET'])
def get_stock_summary(symbol):
    print("company summary")
    
    company_symbol = symbol.upper()
    stock_summary = requests.get(f'https://finnhub.io/api/v1/quote?symbol={company_symbol}&token={api_keyf}')
    print(stock_summary.text)
    print('Stock Summary:', stock_summary.json())
    return stock_summary.json()

@app.route('/recommendations/<symbol>', methods=['GET'])
def get_recommendations(symbol):
    print("company recom")
    
    company_symbol = symbol.upper()
    stock_recommendations = requests.get(f'https://finnhub.io/api/v1/stock/recommendation?symbol={company_symbol}&token={api_keyf}')
    return jsonpickle.encode(stock_recommendations.json())


@app.route('/chart/<symbol>', methods=['GET'])
def get_chart(symbol):
    print("company chart")
   
    current_date = date.today() - relativedelta(days=1)
    start_date = current_date - relativedelta(months=6, days=1)
    company_symbol = symbol.upper()

    api_url = f'https://api.polygon.io/v2/aggs/ticker/{company_symbol}/range/1/day/{start_date}/{current_date}?adjusted=true&sort=asc&apiKey={api_keyp}'
    
    response = requests.get(api_url)
    data = response.json()
    return data


@app.route('/news/<symbol>', methods=['GET'])
def get_news(symbol):
   
    company_symbol = symbol.upper()
    current_date = date.today() - relativedelta(days=1)
    start_date = current_date - relativedelta(months=1)
    stock_news = requests.get(f'https://finnhub.io/api/v1/company-news?symbol={company_symbol}&from={start_date}&to={current_date}&token={api_keyf}')
    return jsonpickle.encode(stock_news.json())


if __name__ == "__main__":
    app.run()
