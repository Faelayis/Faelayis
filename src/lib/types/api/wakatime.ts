export interface WakaLanguage {
	name: string;
	totalSeconds: number;
	percent: number;
	digital: string;
	text: string;
	hours: number;
	minutes: number;
	seconds: number;
}

export interface WakaEditor {
	name: string;
	totalSeconds: number;
	percent: number;
	digital: string;
	text: string;
	hours: number;
	minutes: number;
	seconds: number;
}

export interface WakaOperatingSystem {
	name: string;
	totalSeconds: number;
	percent: number;
	digital: string;
	text: string;
	hours: number;
	minutes: number;
	seconds: number;
}

export interface WakaCategory {
	name: string;
	totalSeconds: number;
	percent: number;
	digital: string;
	text: string;
	hours: number;
	minutes: number;
}

export interface WakaProject {
	name: string;
	totalSeconds: number;
	percent: number;
	digital: string;
	text: string;
	hours: number;
	minutes: number;
}

export interface WakaMachine {
	name: string;
	machineNameId: string;
	totalSeconds: number;
	percent: number;
	digital: string;
	text: string;
	hours: number;
	minutes: number;
	seconds: number;
}

export interface WakaDependency {
	name: string;
	totalSeconds: number;
	percent: number;
	digital: string;
	text: string;
	hours: number;
	minutes: number;
	seconds: number;
}

export interface WakaBestDay {
	date: string;
	text: string;
	totalSeconds: number;
}

export interface WakaRangeInfo {
	start: string;
	end: string;
	timezone: string;
}

export interface WakaStats {
	totalSeconds: number;
	totalSecondsIncludingOtherLanguage: number;
	humanReadableTotal: string;
	humanReadableTotalIncludingOtherLanguage: string;
	dailyAverage: number;
	dailyAverageIncludingOtherLanguage: number;
	humanReadableDailyAverage: string;
	humanReadableDailyAverageIncludingOtherLanguage: string;
	languages: WakaLanguage[];
	editors: WakaEditor[];
	operatingSystems: WakaOperatingSystem[];
	categories: WakaCategory[];
	projects: WakaProject[];
	machines: WakaMachine[];
	dependencies: WakaDependency[];
	bestDay: WakaBestDay | null;
	range: string;
	humanReadableRange: string;
	start: string;
	end: string;
	timezone: string;
	holidays: number;
	daysIncludingHolidays: number;
	daysMinusHolidays: number;
	isUpToDate: boolean;
}

export interface RawWakaLanguage {
	name: string;
	total_seconds?: number;
	percent?: number;
	digital?: string;
	text?: string;
	hours?: number;
	minutes?: number;
	seconds?: number;
}

export interface RawWakaEditor {
	name: string;
	total_seconds?: number;
	percent?: number;
	digital?: string;
	text?: string;
	hours?: number;
	minutes?: number;
	seconds?: number;
}

export interface RawWakaOperatingSystem {
	name: string;
	total_seconds?: number;
	percent?: number;
	digital?: string;
	text?: string;
	hours?: number;
	minutes?: number;
	seconds?: number;
}

export interface RawWakaCategory {
	name: string;
	total_seconds?: number;
	percent?: number;
	digital?: string;
	text?: string;
	hours?: number;
	minutes?: number;
}

export interface RawWakaProject {
	name: string;
	total_seconds?: number;
	percent?: number;
	digital?: string;
	text?: string;
	hours?: number;
	minutes?: number;
}

export interface RawWakaMachine {
	name: string;
	machine_name_id?: string;
	total_seconds?: number;
	percent?: number;
	digital?: string;
	text?: string;
	hours?: number;
	minutes?: number;
	seconds?: number;
}

export interface RawWakaDependency {
	name: string;
	total_seconds?: number;
	percent?: number;
	digital?: string;
	text?: string;
	hours?: number;
	minutes?: number;
	seconds?: number;
}

export interface RawWakaBestDay {
	date?: string;
	text?: string;
	total_seconds?: number;
}

export interface RawWakaStatsResponse {
	data?: {
		total_seconds?: number;
		total_seconds_including_other_language?: number;
		human_readable_total?: string;
		human_readable_total_including_other_language?: string;
		daily_average?: number;
		daily_average_including_other_language?: number;
		human_readable_daily_average?: string;
		human_readable_daily_average_including_other_language?: string;
		languages?: RawWakaLanguage[];
		editors?: RawWakaEditor[];
		operating_systems?: RawWakaOperatingSystem[];
		categories?: RawWakaCategory[];
		projects?: RawWakaProject[];
		machines?: RawWakaMachine[];
		dependencies?: RawWakaDependency[];
		best_day?: RawWakaBestDay;
		range?: string;
		human_readable_range?: string;
		start?: string;
		end?: string;
		timezone?: string;
		holidays?: number;
		days_including_holidays?: number;
		days_minus_holidays?: number;
		is_up_to_date?: boolean;
	};
}
