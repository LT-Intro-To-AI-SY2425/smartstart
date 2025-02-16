setlevel = 0;

def set_light_values(brightness: int, color_temp: str):
    """Set the brightness and color temperature of a room light. (mock API).

    Args:
        brightness: Light level from 0 to 100. Zero is off and 100 is full brightness
        color_temp: Color temperature of the light fixture, which can be `daylight`, `cool` or `warm`.

    Returns:
        None
    """
    global setlevel
    setlevel = brightness
    print("twas set to" + str(brightness) + " and " + color_temp)


def get_light_values():
    """Gets the current brightness and color temperature of a room light. (mock API).

    Returns:
        dict: A dictionary with the current light values.
    """
    print('got light values')
    return {
        "brightness": setlevel,
        "color_temp": "daylight",
    }