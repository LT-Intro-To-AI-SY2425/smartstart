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
    "ALUMINUM": "float64",
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

def get_available_dates(name: str):
    """Returns a sorted list of dates for which data is available for a given commodity.

    This function checks the dataset and returns all unique dates where the 
    specified commodity has a non-null price.

    Args:
        name: The name of the commodity.

    Returns:
        A sorted list of datetime objects representing the dates when data is available.
    """
    name = name.upper()
    available_dates = df.loc[~df[name].isnull(), "Date"].unique()
    return sorted(list(available_dates))

def get_available_commotities():
    """Returns a list of all available commodities in the dataset.

    Returns:
        A list of all available commodities.
    """
    return [col.lower() for col in df.columns[1:]]

def get_date_commodity_price(name: str, year: int, month: int, day: int):
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

def get_month_commodity_prices(name: str, year: int, month: int):
    """Returns a list of commodity prices for a specific month in USD.

    Args:
        name: The name of the commodity.
        year: The year of the desired month as YYYY.
        month: The month of the desired month as MM.

    Returns:
        A list of commodity prices for the specific month.
    """
    returnObj = []
    for(i, row) in df.iterrows():
        if row["Date"].month == month and row["Date"].year == year:
            returnObj.append(row[name])
    return returnObj
    
def get_range_commodity_prices(name: str, start_date: datetime.datetime, end_date: datetime.datetime):
    """Returns a list of commodity prices for a specific date range in USD.

    Args:
        name: The name of the commodity.
        start_date: The start date of the desired range as a datetime object.
        end_date: The end date of the desired range as a datetime object.

    Returns:
        A list of commodity prices for the specific date range.
    """
    returnObj = []
    for(i, row) in df.iterrows():
        if row["Date"] >= start_date and row["Date"] <= end_date:
            if(not pd.isnull(row[name])):
                returnObj.append(row[name])
    return returnObj

def get_closest_date_commodity_price(name: str, year: int, month: int, day: int):
    """
    Returns the commodity price for the closest available date to the specified date.
    
    Args:
        name: The name of the commodity.
        year: The year of the desired date as YYYY.
        month: The month of the desired date as MM.
        day: The day of the desired date as DD.
        
    Returns:
        A tuple (closest_date, price) where closest_date is an ISO-formatted string of the found date,
        or (None, None) if no data is available.
    """
    requested_date = datetime.datetime(year, month, day)
    available_dates = get_available_dates(name)
    
    if not available_dates:
        return (None, None)
    
    closest_date = min(available_dates, key=lambda d: abs(d - requested_date))
    price = get_date_commodity_price(name, closest_date.year, closest_date.month, closest_date.day)
    
    return (closest_date.isoformat(), price)
