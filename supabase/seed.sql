-- Seed file for local development
-- This file is executed after migrations when running `supabase db reset`
INSERT INTO public.events (
        title,
        description,
        location,
        start_time,
        end_time,
        image_url
    )
VALUES (
        'Winter Showcase',
        'Join us for our annual winter showcase featuring performances from all sections of the band.',
        'Main Auditorium',
        '2025-01-15 18:00:00+00',
        '2025-01-15 21:00:00+00',
        ''
    ),
    (
        'Jazz Night',
        'An evening of jazz featuring our top performers. Light refreshments will be served.',
        'Music Hall',
        '2025-01-22 19:00:00+00',
        '2025-01-22 22:00:00+00',
        ''
    ),
    (
        'Spring Concert',
        'Our biggest concert of the year! Come support the band as we perform pieces from around the world.',
        'Campus Theater',
        '2025-03-08 17:30:00+00',
        '2025-03-08 20:30:00+00',
        ''
    ),
    (
        'Ensemble Workshop',
        NULL,
        'Practice Room B',
        '2025-02-12 14:00:00+00',
        '2025-02-12 16:00:00+00',
        ''
    );