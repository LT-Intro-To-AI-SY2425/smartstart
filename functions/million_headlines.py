import datetime
import pandas as pd

dtypes = {
    "publish_date": "int",
    "headline_text": "string",
}
dateparse = lambda x: datetime.strptime(x, '%Y%m%d')
df = pd.read_csv("data_sources/million_headlines.csv", dtype=dtypes, parse_dates=["publish_date"], date_format="%Y%m%d")

df["publish_date"] = pd.to_datetime(df["publish_date"], format="%Y%m%d")

def contains_all_keywords(text, keywords):
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
    return df.loc[df["publish_date"] == date, "headline_text"].values.tolist()
    


def get_keyword_headlines(keywords: list[str]):
    """Returns a list of headlines containing specified keywords.

    Args:
        keywords: The keywords to search for in the headlines.
    Returns:
        A list of headlines containing the specified keyword.
    """
    filtered_headlines = df[df["headline_text"].apply(lambda x: contains_all_keywords(x, keywords))]
    return filtered_headlines[["publish_date", "headline_text"]].values.tolist()


keywords = input("Enter keywords separated by commas: ").split(",")
print("gooning through the database...")
headlines = get_keyword_headlines(keywords)
print()
for headline in headlines:
    print(f"{headline[0]}: {headline[1]}")
