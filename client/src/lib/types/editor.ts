/**
 * Editor Types
 *
 * TypeScript interfaces for the unified editor system.
 * This replaces the 4 duplicate editor components with a single configurable editor.
 */

export type EditorFieldType =
	| 'text'
	| 'textarea'
	| 'url'
	| 'date'
	| 'select'
	| 'state'
	| 'degree';

export interface EditorFieldOption {
	value: string;
	label: string;
}

export interface EditorField {
	id: string;
	label: string;
	type: EditorFieldType;
	placeholder?: string;
	required?: boolean;
	options?: EditorFieldOption[];
	disabled?: boolean;
}

export interface EditorDateConfig {
	startDateField: string;
	endDateField: string;
	currentField: string;
	currentLabel: string;
}

export interface EditorConfig {
	entityType: 'job' | 'school' | 'volunteer' | 'project';
	title: string;
	apiEndpoint: string;
	fields: EditorField[];
	dateConfig: EditorDateConfig;
	highlightsLabel: string;
	highlightsPlaceholder: string;
	brainstormPlaceholder: string;
	aiSuggestions: readonly string[];
}

export type EntityType = 'job' | 'school' | 'volunteer' | 'project';

// Generic editor data type
export interface EditorData {
	id?: number;
	highlights?: string[];
	startDate?: string;
	endDate?: string;
	endDateCurrent?: boolean;
	[key: string]: unknown;
}
