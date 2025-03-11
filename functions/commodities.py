import datetime
import logging
from models import db, CommodityFutures

logger = logging.getLogger(__name__)

def get_available_dates(name: str):
    """Returns a sorted list of dates for which data is available for a given commodity.

    Args:
        name: The name of the commodity.

    Returns:
        A sorted list of datetime objects representing the dates when data is available.
    """
    try:
        name = name.upper().replace(" ", "_")
        logger.info(f"Fetching available dates for commodity: {name}")
        
        result = db.session.query(CommodityFutures.Date)\
            .filter(getattr(CommodityFutures, name).isnot(None))\
            .order_by(CommodityFutures.Date)\
            .all()
        
        dates = [date[0] for date in result]
        logger.debug(f"found {len(dates)} dates for {name}")
        return dates
        
    except Exception as e:
        logger.error(f"error getting available dates for {name}: {str(e)}")
        raise

def get_available_commotities():
    """Returns a list of all available commodities in the dataset.

    Returns:
        A list of all available commodities.
    """
    try:
        logger.info("fetching list of available commodities")
        commodities = [col.key.lower().replace("_", " ") for col in CommodityFutures.__table__.columns 
                      if col.key != 'Date']
        
        logger.debug(f"found {len(commodities)} commodities: {commodities}")
        return commodities
        
    except Exception as e:
        logger.error(f"error getting available commodities: {str(e)}")
        raise

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
    try:
        name = name.upper().replace(" ", "_")
        target_date = datetime.datetime(year, month, day)
        logger.info(f"fetching price for {name} on {target_date.isoformat()}")
        
        result = db.session.query(getattr(CommodityFutures, name))\
            .filter(db.func.date(CommodityFutures.Date) == target_date.date())\
            .first()
            
        logger.debug(f"query for date {target_date.isoformat()} returned: {result[0] if result else None}")
        price = result[0] if result else None
        logger.debug(f"price for {name} on {target_date.isoformat()}: {price}")
        return price
        
    except Exception as e:
        logger.error(f"error getting price for {name} on {year}-{month}-{day}: {str(e)}")
        raise

def get_month_commodity_prices(name: str, year: int, month: int):
    """Returns a list of commodity prices for a specific month in USD.

    Args:
        name: The name of the commodity.
        year: The year of the desired month as YYYY.
        month: The month of the desired month as MM.

    Returns:
        A list of commodity prices for the specific month.
    """
    try:
        name = name.upper().replace(" ", "_")
        start_date = datetime.datetime(year, month, 1)
        if month == 12:
            end_date = datetime.datetime(year + 1, 1, 1)
        else:
            end_date = datetime.datetime(year, month + 1, 1)
            
        logger.info(f"fetching prices for {name} between {start_date.isoformat()} and {end_date.isoformat()}")
        
        result = db.session.query(getattr(CommodityFutures, name))\
            .filter(CommodityFutures.Date >= start_date)\
            .filter(CommodityFutures.Date < end_date)\
            .filter(getattr(CommodityFutures, name).isnot(None))\
            .all()
            
        prices = [price[0] for price in result]
        logger.debug(f"found {len(prices)} prices for {name} in {year}-{month}")
        return prices
        
    except Exception as e:
        logger.error(f"error getting month prices for {name} in {year}-{month}: {str(e)}")
        raise

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
    """Returns the commodity price for the closest available date to the specified date.
    
    Args:
        name: The name of the commodity.
        year: The year of the desired date as YYYY.
        month: The month of the desired date as MM.
        day: The day of the desired date as DD.
        
    Returns:
        A tuple (closest_date, price) where closest_date is an ISO-formatted string of the found date,
        or (None, None) if no data is available.
    """
    try:
        name = name.upper().replace(" ", "_")
        target_date = datetime.datetime(year, month, day)
        logger.info(f"finding closest date price for {name} near {target_date.isoformat()}")
        
        # get the closest date before and after the target date
        before_date = db.session.query(CommodityFutures.Date)\
            .filter(CommodityFutures.Date <= target_date)\
            .filter(getattr(CommodityFutures, name).isnot(None))\
            .order_by(CommodityFutures.Date.desc())\
            .first()
        logger.debug(f"query for date before {target_date.isoformat()} returned: {before_date[0].isoformat() if before_date else None}")
            
        after_date = db.session.query(CommodityFutures.Date)\
            .filter(CommodityFutures.Date >= target_date)\
            .filter(getattr(CommodityFutures, name).isnot(None))\
            .order_by(CommodityFutures.Date)\
            .first()
        logger.debug(f"query for date after {target_date.isoformat()} returned: {after_date[0].isoformat() if after_date else None}")
        
        if not before_date and not after_date:
            logger.warning(f"no data found for {name} around {target_date.isoformat()}")
            return (None, None)
            
        # determine which date is closer
        if not before_date:
            closest_date = after_date[0]
            logger.debug(f"using next available date: {closest_date.isoformat()}")
        elif not after_date:
            closest_date = before_date[0]
            logger.debug(f"using previous available date: {closest_date.isoformat()}")
        else:
            before_diff = abs((target_date - before_date[0]).days)
            after_diff = abs((after_date[0] - target_date).days)
            closest_date = before_date[0] if before_diff <= after_diff else after_date[0]
            logger.debug(f"found closest date: {closest_date.isoformat()}")
        
        logger.debug(f"closest date: {closest_date.isoformat()}")
        price = get_date_commodity_price(name, closest_date.year, closest_date.month, closest_date.day)
        logger.info(f"returning price {price} for {name} on {closest_date.isoformat()}")
        return (closest_date.isoformat(), price)
        
    except Exception as e:
        logger.error(f"error getting closest date price for {name} near {year}-{month}-{day}: {str(e)}")
        raise
