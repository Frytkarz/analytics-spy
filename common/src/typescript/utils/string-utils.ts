export class StringUtils {
    public static isNullOrEmpty(value: string | null | undefined): boolean {
        return value == null || value === '';
    }

    public static excludeNullsOrEmpties(...values: (string | null | undefined)[]): string[] {
        return values.filter(v => !this.isNullOrEmpty(v)) as string[];
    }
}