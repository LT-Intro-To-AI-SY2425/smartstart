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
import time
from models import db, Headlines
from fuzzywuzzy import fuzz
from typing import List, Dict
from datetime import datetime
from sqlalchemy import func, text
from functools import lru_cache
import json
from rapidfuzz import process, fuzz
import re
9
logger = logging.getLogger(__name__)

def json_serializable_result(result):
    """converts the result to JSON serializable format, returning a python object (not a string)"""
    return result

# ai fuckery below!!!! so sorry

def search_headlines_by_keyword(keyword: str, limit: int) -> List[Dict]:
    """Cached version of search_headlines_by_keyword. Search headlines using fuzzy string matching. All parameters are required. Returns a list of dicts.
    
    Args:
        keyword: the search term to look for in headlines
        limit: maximum number of results to return
        
    Returns:
        list of dicts containing headline text, date, similarity score, and link
    """
    logger.info(f"searching headlines with keyword: {keyword}")

    return cached_search_headlines_by_keyword(keyword, 75, limit)

@lru_cache(maxsize=100)
def cached_search_headlines_by_keyword(keyword: str, min_similarity: int, limit: int) -> List[Dict]:
    """Cached version of search_headlines_by_keyword. Uses cached data for faster repeated access.
    
    Args:
        keyword: The search term to look for in headlines
        min_similarity: Minimum similarity ratio (0-100) for fuzzy matching
        limit: Maximum number of results to return
        
    Returns:
        List of dicts containing headline text, date, similarity score, and link
    """
    results = search_headlines_by_keyword_uncached(keyword, min_similarity, limit)
    return results

def search_headlines_by_keyword_uncached(keyword: str, min_similarity: int, limit: int) -> List[Dict]:
    """Search headlines using fuzzy string matching. All parameters are required.
    
    Args:
        keyword: the search term to look for in headlines, comma seperated keywords work
        min_similarity: minimum similarity ratio (0-100) for fuzzy matching
        limit: maximum number of results to return
        
    Returns:
        list of dicts containing headline text, date, similarity score, and link
    """    
    start_time = time.time()
    
    try:
        logger.info(f"searching headlines from database with keywords: {keyword}")

        prep_start_time = time.time()
        # da
        keywords = [k.strip() for k in keyword.split(',')]

        prep_elapsed_time = time.time() - prep_start_time
        logger.debug(f"keyword preparation took {prep_elapsed_time:.4f} seconds")

        query_start_time = time.time()
        # more da
        like_conditions = [
            f"LOWER(Headline) REGEXP '\\b{keywords[i]}\\b|{keywords[i]}-' " for i in range(len(keywords))
        ]

        # more more da
        query_conditions = " OR ".join(like_conditions)
        query_params = {f"keyword{i}": f"%{keywords[i]}%" for i in range(len(keywords))}


        query_elapsed_time = time.time() - query_start_time
        logger.debug(f"query construction took {query_elapsed_time:.4f} seconds")

        execute_start_time = time.time()

        # database query:	O(N)	     ->  O(N) (but likely O(log N) with indexing)
        # fuzzy matching:	O(N * m)     ->  O(limit * 5 * m)
        # sorting	    :   O(N log N)   ->  O(limit log limit)
        query = text(f"""
            SELECT Headline, Date, URL FROM headlines
            WHERE {query_conditions}
            ORDER BY Date DESC
            LIMIT :limit
        """)

        fetched_headlines = db.session.execute(query, {**query_params, 'limit': limit * 5}).fetchall()

        execute_elapsed_time = time.time() - execute_start_time
        logger.debug(f"SQL execution took {execute_elapsed_time:.4f} seconds")

        if not fetched_headlines:
            return []

        process_start_time = time.time()

        headlines_list = [(row[0], row[1], row[2]) for row in fetched_headlines]

        matched_headlines = [
            {'headline': h, 'date': d.isoformat() if isinstance(d, datetime) else d, 'similarity': s, 'link': u}
            for h, d, u, s in (
                (h, d, u, fuzz.partial_ratio(keyword.lower(), h.lower())) for h, d, u in headlines_list
            )
            if s >= min_similarity and re.search(r'\b' + re.escape(keywords[0]) + r'\b', h.lower())  # Match full word
        ]

        process_elapsed_time = time.time() - process_start_time
        logger.debug(f"result processing took {process_elapsed_time:.4f} seconds")

        sort_start_time = time.time()

        results = sorted(matched_headlines, key=lambda x: x['similarity'], reverse=True)[:limit]

        sort_elapsed_time = time.time() - sort_start_time
        logger.debug(f"sorting results took {sort_elapsed_time:.4f} seconds")

        total_elapsed_time = time.time() - start_time
        logger.info(f"found {len(results)} matching headlines for '{keyword}' in {total_elapsed_time:.4f} seconds")
        return results

    except Exception as e:
        logger.error(f"error searching headlines with keywords '{keyword}': {str(e)}")
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