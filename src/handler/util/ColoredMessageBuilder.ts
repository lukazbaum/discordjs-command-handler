import { BackgroundColor, Color, Format } from "../types/Formatting";

export class ColoredMessageBuilder {
    private message: string = "";
    private readonly start: string = "\u001b[";
    private readonly reset: string = "\u001b[0m";

    public add(text: string, color: Color): this;
    public add(text: string, backgroundColor: BackgroundColor): this;
    public add(text: string, color: Color, format: Format): this;
    public add(text: string, color: Color, backgroundColor: BackgroundColor): this;
    public add(text: string, color: Color, backgroundColor: BackgroundColor, format: Format): this;

    public add(
        text: string,
        param1: Color | BackgroundColor,
        param2?: BackgroundColor | Format,
        param3: Format = Format.Normal
    ): this {
        let params: any = [param1, param2, param3];

        let color, backgroundColor, format;
        for (const param of params) {
            if (Object.values(Color).includes(param)) color = param;
            if (Object.values(BackgroundColor).includes(param)) backgroundColor = param;
            if (Object.values(Format).includes(param)) format = param;
        }

        if (backgroundColor) backgroundColor = `${backgroundColor};`;
        else backgroundColor = BackgroundColor.None;

        this.message += `${this.start}${format};${backgroundColor}${color}m${text}${this.reset}`;
        return this;
    };

    public addRainbow(text: string, format: Format = Format.Normal): this {
        const rainbowColors: Color[] = [
            Color.Red,
            Color.Yellow,
            Color.Green,
            Color.Cyan,
            Color.Blue,
            Color.Pink
        ];

        let rainbowText: string = "";
        for (let i = 0; i < text.length; i++) {
            const char = text.charAt(i);
            const color = rainbowColors[i % rainbowColors.length];
            rainbowText += `${this.start}${format};${color}m${char}${this.reset}`;
        }

        this.message += rainbowText;
        return this;
    };

    public addNewLine(): this {
        this.message += "\n";
        return this;
    };

    public build(): string {
        return `\`\`\`ansi\n${this.message}\n\`\`\``;
    };
}

export function colored(text: string, color: Color): string;
export function colored(text: string, backgroundColor: BackgroundColor): string;
export function colored(text: string, color: Color, format: Format): string;
export function colored(text: string, color: Color, backgroundColor: BackgroundColor): string;
export function colored(text: string, color: Color, backgroundColor: BackgroundColor, format: Format): string;

export function colored(
    text: string,
    param1: Color | BackgroundColor,
    param2?: BackgroundColor | Format,
    param3: Format = Format.Normal
): string {
    let params: any = [param1, param2, param3];

    let color, backgroundColor, format;
    for (const param of params) {
        if (Object.values(Color).includes(param)) color = param;
        if (Object.values(BackgroundColor).includes(param)) backgroundColor = param;
        if (Object.values(Format).includes(param)) format = param;
    }

    if (backgroundColor) backgroundColor = `${backgroundColor};`;
    else backgroundColor = BackgroundColor.None;

    return `\`\`\`ansi\n\u001b[${format};${backgroundColor}${color}m${text}\u001b[0m\n\`\`\``;
}

export function rainbow(text: string, format = Format.Normal): string {
    const rainbowColors: Color[] = [
        Color.Red,
        Color.Yellow,
        Color.Gray,
        Color.Cyan,
        Color.Blue,
        Color.Pink
    ];

    let rainbowText: string = "";
    for (let i = 0; i < text.length; i++) {
        const char = text.charAt(i);
        const color = rainbowColors[i % rainbowColors.length];
        rainbowText += `\u001b[${format};${color}m${char}\u001b[0m`;
    }

    return `\`\`\`ansi\n${rainbowText}\n\`\`\``;
}