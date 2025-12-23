'use client';

interface FormattedDateProps {
    dateString: string;
    className?: string;
}

export function FormattedDate({ dateString, className }: FormattedDateProps) {
    const date = new Date(dateString);

    const formatted = date.toLocaleString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        timeZoneName: 'short'
    });

    return <span className={className}>{formatted}</span>;
}
