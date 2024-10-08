export type FileType = {
    file_name: string
    file_data: string
}

export type RequestJournalRow = {
    request_guid: string
    request_date: string
    request_comment: string
    request_processed: boolean
    files: FileType[]
}

export type File = {
    file_name: string;
    file_presentation: string;
};

export type ArchiveRowData = {
    request_guid: string;
    document_date: string;
    document_number: string;
    document_presentation: string;
    document_presentation_guid: string;
    document_type: 'IN' | 'OUT';
    record_date: string;
    record_status: 'IN_PROCESS' | 'FINISHED' | 'REJECTED';
    record_status_comment: string;
    record_comment: string;
    organization_name: string;
    organization_guid: string;
    tax_period: 'PERIOD_MONTH' | 'PERIOD_Q1' | 'PERIOD_Q2' | 'PERIOD_Q3' | 'PERIOD_Q4' | 'PERIOD_YEAR';
    tax_period_end_date: string;
    files: File[];
};