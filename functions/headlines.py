# I might be too strung out on compliments
# Overdosed on confidence
# Started not to give a fuck and stopped fearin' the consequence
# Drinkin' every night because we drink to my accomplishments
# Faded way too long, I'm floatin' in and out of consciousness
# And they sayin' I'm back, I'd agree with that
# I just take my time with all this shit, I still believe in that
# I had someone tell me I fell off, ooh, I needed that
# And they want to see me pick back up, well, where'd I leave it at?

import logging
from models import db, Headlines
from fuzzywuzzy import fuzz
from typing import List, Dict
from datetime import datetime
from sqlalchemy import func
from functools import lru_cache
import json

logger = logging.getLogger(__name__)

def json_serializable_result(result):
    return json.dumps(result, sort_keys=True)

@lru_cache(maxsize=100)
def cached_search_headlines_by_keyword(keyword: str, min_similarity: int, limit: int) -> str:
    """Cached version of search_headlines_by_keyword. Returns JSON to ensure cacheability."""
    results = search_headlines_by_keyword_uncached(keyword, min_similarity, limit)
    return json_serializable_result(results)

def search_headlines_by_keyword_uncached(keyword: str, min_similarity: int, limit: int) -> List[Dict]:
    """Search headlines using fuzzy string matching. All parameters are required.
    
    Args:
        keyword: The search term to look for in headlines
        min_similarity: Minimum similarity ratio (0-100) for fuzzy matching
        limit: Maximum number of results to return
        
    Returns:
        List of dicts containing headline text, date, similarity score, and link
    """
    try:
        logger.info(f"Searching headlines with keyword: {keyword}")
        
        headlines = db.session.query(Headlines.Headline, Headlines.Date, Headlines.URL).order_by(Headlines.Date.desc()).all()
        
        # calculate similarity scores and filter
        matched_headlines = []
        for headline, date, URL in headlines:
            if headline is not None:
                ratio = fuzz.partial_ratio(keyword.lower(), headline.lower())
                if ratio >= min_similarity:
                    matched_headlines.append({
                        'headline': headline,
                        'date': date.isoformat() if isinstance(date, datetime) else date,
                        'similarity': ratio,
                        'link': URL
                    })
        
        # Sort by similarity score and limit results
        matched_headlines.sort(key=lambda x: x['similarity'], reverse=True)
        results = matched_headlines[:limit]
        
        logger.debug(f"Found {len(results)} matching headlines for '{keyword}'")
        return results
        
    except Exception as e:
        logger.error(f"Error searching headlines with keyword '{keyword}': {str(e)}")
        raise



# def get_headlines_by_date_range(start_date: str, end_date: str, limit: int, keyword: str, min_similarity: int) -> List[Dict]:
#     """Get headlines within a specific date range and matching a keyword.
    
#     Args:
#         start_date: Start date for headline search (ISO 8601 string format)
#         end_date: End date for headline search (ISO 8601 string format)
#         limit: Maximum number of results to return, default is 50
#         keyword: The search term to look for in headlines (optional, but recommended)
#         min_similarity: Minimum similarity ratio (0-100) for fuzzy matching, default is 60
        
#     Returns:
#         List of dicts containing headline text, date, similarity score, and link
#     """
#     try:
#         start_date = datetime.fromisoformat(start_date)
#         end_date = datetime.fromisoformat(end_date)

#         logger.info(f"Fetching headlines between {start_date.isoformat()} and {end_date.isoformat()} with keyword: {keyword}")

#         query = db.session.query(Headlines.Headline, Headlines.Date, Headlines.URL) \
#             .filter(Headlines.Date >= start_date) \
#             .filter(Headlines.Date <= end_date)

#         if keyword:
#             query = query.filter(fuzz.partial_ratio(func.lower(Headlines.Headline), keyword.lower()) >= min_similarity)

#         db_results = query.order_by(Headlines.Date.desc()).limit(limit).all()

#         # calculate similarity scores and filter
#         matched_headlines = []
#         for headline, date, URL in db_results:
#             if headline is not None:
#                 ratio = fuzz.partial_ratio(keyword.lower(), headline.lower())
#                 if ratio >= min_similarity:
#                     matched_headlines.append({
#                         'headline': headline,
#                         'date': date.isoformat() if isinstance(date, datetime) else date,
#                         'similarity': ratio,
#                         'link': URL
#                     })
        
#         # sort by similarity score and limit results
#         matched_headlines.sort(key=lambda x: x['similarity'], reverse=True)
#         results = matched_headlines[:limit]
        
#         return results

#     except Exception as e:
#         logger.error(f"Error getting headlines for date range: {str(e)}")
#         raise

# def get_related_headlines(headline_text: str, min_similarity: int, limit: int) -> List[Dict]:
#     """Find headlines similar to a given headline text.
    
#     Args:
#         headline_text: The headline to find similar matches for
#         min_similarity: Minimum similarity ratio (0-100) for fuzzy matching, default is 70
#         limit: Maximum number of results to return, default is 5
        
#     Returns:
#         List of dicts containing related headline text, date, and similarity score
#     """
#     try:
#         logger.info(f"Finding headlines related to: {headline_text}")

#         # Use a subquery to filter headlines based on a preliminary similarity check
#         subquery = db.session.query(
#             Headlines.Headline,
#             Headlines.Date,
#             fuzz.ratio(headline_text.lower(), Headlines.Headline.lower()).label('similarity')
#         ).filter(
#             fuzz.ratio(headline_text.lower(), Headlines.Headline.lower()) >= min_similarity
#         ).subquery()

#         # Fetch only the relevant headlines with calculated similarity
#         results = db.session.query(subquery).order_by(subquery.c.similarity.desc()).limit(limit).all()

#         related = [{
#             'headline': h[0],
#             'date': h[1].isoformat() if isinstance(h[1], datetime) else h[1],
#             'similarity': h[2]
#         } for h in results]

#         logger.debug(f"found {len(related)} related headlines")
#         return related
        
#     except Exception as e:
#         logger.error(f"error finding related headlines: {str(e)}")
#         raise