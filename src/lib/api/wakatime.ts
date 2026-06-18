import type {
	RawWakaBestDay,
	RawWakaCategory,
	RawWakaDependency,
	RawWakaEditor,
	RawWakaLanguage,
	RawWakaMachine,
	RawWakaOperatingSystem,
	RawWakaProject,
	RawWakaStatsResponse,
	WakaBestDay,
	WakaCategory,
	WakaDependency,
	WakaEditor,
	WakaLanguage,
	WakaMachine,
	WakaOperatingSystem,
	WakaProject,
	WakaStats,
} from "$types/api/wakatime";
import type { WakaRange } from "$types/api/wakatime-range";

export const WAKA_RANGES: Record<WakaRange, WakaRange> = {
	last_7_days: "last_7_days",
	last_30_days: "last_30_days",
	last_6_months: "last_6_months",
	last_year: "last_year",
	all_time: "all_time",
};

function emptyStats(range: WakaRange): WakaStats {
	return {
		totalSeconds: 0,
		totalSecondsIncludingOtherLanguage: 0,
		humanReadableTotal: "—",
		humanReadableTotalIncludingOtherLanguage: "—",
		dailyAverage: 0,
		dailyAverageIncludingOtherLanguage: 0,
		humanReadableDailyAverage: "—",
		humanReadableDailyAverageIncludingOtherLanguage: "—",
		languages: [],
		editors: [],
		operatingSystems: [],
		categories: [],
		projects: [],
		machines: [],
		dependencies: [],
		bestDay: null,
		range,
		humanReadableRange: range,
		start: "",
		end: "",
		timezone: "",
		holidays: 0,
		daysIncludingHolidays: 0,
		daysMinusHolidays: 0,
		isUpToDate: false,
	};
}

function mapLanguage(raw: RawWakaLanguage): WakaLanguage {
	return {
		name: raw.name,
		totalSeconds: raw.total_seconds ?? 0,
		percent: raw.percent ?? 0,
		digital: raw.digital ?? "0s",
		text: raw.text ?? "0 secs",
		hours: raw.hours ?? 0,
		minutes: raw.minutes ?? 0,
		seconds: raw.seconds ?? 0,
	};
}

function mapEditor(raw: RawWakaEditor): WakaEditor {
	return {
		name: raw.name,
		totalSeconds: raw.total_seconds ?? 0,
		percent: raw.percent ?? 0,
		digital: raw.digital ?? "0s",
		text: raw.text ?? "0 secs",
		hours: raw.hours ?? 0,
		minutes: raw.minutes ?? 0,
		seconds: raw.seconds ?? 0,
	};
}

function mapOperatingSystem(raw: RawWakaOperatingSystem): WakaOperatingSystem {
	return {
		name: raw.name,
		totalSeconds: raw.total_seconds ?? 0,
		percent: raw.percent ?? 0,
		digital: raw.digital ?? "0s",
		text: raw.text ?? "0 secs",
		hours: raw.hours ?? 0,
		minutes: raw.minutes ?? 0,
		seconds: raw.seconds ?? 0,
	};
}

function mapCategory(raw: RawWakaCategory): WakaCategory {
	return {
		name: raw.name,
		totalSeconds: raw.total_seconds ?? 0,
		percent: raw.percent ?? 0,
		digital: raw.digital ?? "0s",
		text: raw.text ?? "0 secs",
		hours: raw.hours ?? 0,
		minutes: raw.minutes ?? 0,
	};
}

function mapProject(raw: RawWakaProject): WakaProject {
	return {
		name: raw.name,
		totalSeconds: raw.total_seconds ?? 0,
		percent: raw.percent ?? 0,
		digital: raw.digital ?? "0s",
		text: raw.text ?? "0 secs",
		hours: raw.hours ?? 0,
		minutes: raw.minutes ?? 0,
	};
}

function mapMachine(raw: RawWakaMachine): WakaMachine {
	return {
		name: raw.name,
		machineNameId: raw.machine_name_id ?? raw.name,
		totalSeconds: raw.total_seconds ?? 0,
		percent: raw.percent ?? 0,
		digital: raw.digital ?? "0s",
		text: raw.text ?? "0 secs",
		hours: raw.hours ?? 0,
		minutes: raw.minutes ?? 0,
		seconds: raw.seconds ?? 0,
	};
}

function mapDependency(raw: RawWakaDependency): WakaDependency {
	return {
		name: raw.name,
		totalSeconds: raw.total_seconds ?? 0,
		percent: raw.percent ?? 0,
		digital: raw.digital ?? "0s",
		text: raw.text ?? "0 secs",
		hours: raw.hours ?? 0,
		minutes: raw.minutes ?? 0,
		seconds: raw.seconds ?? 0,
	};
}

function mapBestDay(raw: RawWakaBestDay | undefined): WakaBestDay | null {
	if (!raw || raw.date === undefined) return null;
	return {
		date: raw.date ?? "",
		text: raw.text ?? "—",
		totalSeconds: raw.total_seconds ?? 0,
	};
}

export async function fetchWakaStats(username: string, range: WakaRange = "last_30_days", apiKey?: string, signal?: AbortSignal): Promise<WakaStats> {
	if (!apiKey || !username) {
		return emptyStats(range);
	}

	const url = new URL(`https://wakatime.com/api/v1/users/${username}/stats/${WAKA_RANGES[range]}`);
	url.searchParams.set("api_key", apiKey);

	const response = await fetch(url.toString(), {
		headers: { Accept: "application/json" },
		signal,
	});
	if (!response.ok) {
		throw new Error(`WakaTime API error: ${response.status}`);
	}

	const raw = (await response.json()) as RawWakaStatsResponse;
	const data = raw.data;
	if (!data) return emptyStats(range);

	return {
		totalSeconds: data.total_seconds ?? 0,
		totalSecondsIncludingOtherLanguage: data.total_seconds_including_other_language ?? 0,
		humanReadableTotal: data.human_readable_total ?? "—",
		humanReadableTotalIncludingOtherLanguage: data.human_readable_total_including_other_language ?? "—",
		dailyAverage: data.daily_average ?? 0,
		dailyAverageIncludingOtherLanguage: data.daily_average_including_other_language ?? 0,
		humanReadableDailyAverage: data.human_readable_daily_average ?? "—",
		humanReadableDailyAverageIncludingOtherLanguage: data.human_readable_daily_average_including_other_language ?? "—",
		languages: (data.languages ?? []).map(mapLanguage),
		editors: (data.editors ?? []).map(mapEditor),
		operatingSystems: (data.operating_systems ?? []).map(mapOperatingSystem),
		categories: (data.categories ?? []).map(mapCategory),
		projects: (data.projects ?? []).map(mapProject),
		machines: (data.machines ?? []).map(mapMachine),
		dependencies: (data.dependencies ?? []).map(mapDependency),
		bestDay: mapBestDay(data.best_day),
		range: data.range ?? range,
		humanReadableRange: data.human_readable_range ?? range,
		start: data.start ?? "",
		end: data.end ?? "",
		timezone: data.timezone ?? "",
		holidays: data.holidays ?? 0,
		daysIncludingHolidays: data.days_including_holidays ?? 0,
		daysMinusHolidays: data.days_minus_holidays ?? 0,
		isUpToDate: data.is_up_to_date ?? false,
	};
}
