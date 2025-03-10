import datetime
import pandas as pd

dtypes = {
    "Date": "int",
    "Publication": "string",
    "Headline": "string",
    "URL": "string",
}
dateparse = lambda x: datetime.strptime(x, '%Y%m%d')
df = pd.read_csv("data_sources/massive_headlines.csv", dtype=dtypes, parse_dates=["Date"], date_format="%Y%m%d")

df["Date"] = pd.to_datetime(df["Date"], format="%Y%m%d")

def contains_all_keywords(text, keywords):
    if pd.isna(text):  # Handle NaN values
        return False
    return all(word.lower() in text.lower() for word in keywords)


def get_date_headlines(year: int, month: int, day: int):
    """Returns the price of a commodity at a specific date in USD.

    Args:
        name: The name of the commodity.
        year: The year of the desired date as YYYY.
        month: The month of the desired date as MM.
        day: The day of the desired date as DD.

    Returns:
        The price of the commodity at the specific date or None if the date is not found.
    """
    date = datetime.datetime(year, month, day)
    return df.loc[df["Date"] == date, "Headline"].values.tolist()
    


def get_keyword_headlines(keywords: list[str]):
    """Returns a list of headlines containing specified keywords.

    Args:
        keywords: The keywords to search for in the headlines.
    Returns:
        A list of headlines containing the specified keyword.
    """
    filtered_headlines = df[df["Headline"].apply(lambda x: contains_all_keywords(x, keywords))]
    return filtered_headlines[["Date", "Headline"]].values.tolist()


keywords = input("Enter keywords separated by commas: ").split(",")
print("gooning through the database...")
headlines = get_keyword_headlines(keywords)
print()
for headline in headlines:
    print(f"{headline[0]}: {headline[1]}")
