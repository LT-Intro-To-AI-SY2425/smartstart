import datetime
import pandas as pd

dtypes = {
    "NATURAL GAS": "float64",
    "GOLD": "float64",
    "WTI CRUDE": "float64",
    "BRENT CRUDE": "float64",
    "SOYBEANS": "float64",
    "CORN": "float64",
    "COPPER": "float64",
    "SILVER": "float64",
    "LOW SULPHUR GAS OIL": "float64",
    "LIVE CATTLE": "float64",
    "SOYBEAN OIL": "float64",
    "ALUMINIUM": "float64",
    "SOYBEAN MEAL": "float64",
    "ZINC": "float64",
    "ULS DIESEL": "float64",
    "NICKEL": "float64",
    "WHEAT": "float64",
    "SUGAR": "float64",
    "GASOLINE": "float64",
    "COFFEE": "float64",
    "LEAN HOGS": "float64",
    "HRW WHEAT": "float64",
    "COTTON": "float64",
}


df = pd.read_csv("commodity_futures.csv", dtype=dtypes, parse_dates=["Date"])


def getDateCommodityPrice(name: str, year: int, month: int, day: int):
    """Returns the price of a commodity at a specific date in USD.

    Args:
        name: The name of the commodity.
        year: The year of the desired date as YYYY.
        month: The month of the desired date as MM.
        day: The day of the desired date as DD.

    Returns:
        The price of the commodity at the specific date or None if the date is not found.
    """
    name = name.upper()
    date = datetime.datetime(year, month, day)
    try:
        return df.loc[df["Date"] == date, name].values[0]
    except:
        return None
    


def getMonthCommodityPrices(name, year, month):
    returnObj = []
    for(i, row) in df.iterrows():
        if row["Date"].month == month and row["Date"].year == year:
            returnObj.append(row[name])
    return returnObj
    
def getRangeCommodityPrices(name, start_date, end_date):
    returnObj = []
    for(i, row) in df.iterrows():
        if row["Date"] >= start_date and row["Date"] <= end_date:
            if(not pd.isnull(row[name])):
                returnObj.append(row[name])
    return returnObj

