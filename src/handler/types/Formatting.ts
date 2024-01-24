export enum Color {
    Gray = "30",
    Red = "31",
    Green = "32",
    Yellow = "33",
    Blue = "34",
    Pink = "35",
    Cyan = "36",
    White = "37"
}

export enum BackgroundColor {
    DarkBlue = "40",
    Orange = "41",
    MarbleBlue = "42",
    GrayTurquoise = "43",
    Gray = "44",
    Indigo = "45",
    LightGray = "46",
    White = "47",
    None = ""
}

export enum Format {
    Normal = "0",
    Bold = "1",
    Underline = "4"
}

/**
 * [Documentation](https://gist.github.com/LeviSnoot/d9147767abeef2f770e9ddcd91eb85aa)
 */
export enum TimestampStyle {
    /**
     * November 28, 2018 9:01 AM or 28 November 2018 09:01
     */
    Default = "",

    /**
     * 9:01 AM or 09:01
     */
    ShortTime = ":t",

    /**
     * 9:01:00 AM or 09:01:00
     */
    LongTime = ":T",

    /**
     * 11/28/2018 or 28/11/2018
     */
    ShortDate = ":d",

    /**
     * November 28, 2018 or 28 November 2018
     */
    LongDate = ":D",

    /**
     * November 28, 2018 9:01 AM or 28 November 2018 09:01
     */
    ShortDateTime = ":f",

    /**
     * Wednesday, November 28, 2018 9:01 AM or Wednesday, 28 November 2018 09:01
     */
    LongDateTime = ":F",

    /**
     * 3 years ago
     */
    RelativeTime = ":R"
}