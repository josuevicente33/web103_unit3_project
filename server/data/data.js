export default {
    locations: [
        { name: "Downtown Community Center", address: "123 Main St, Springfield, IL 62701", capacity: 300 },
        { name: "Riverside Park Pavilion",   address: "400 River Rd, Springfield, IL 62702", capacity: 150 },
        { name: "Tech Hub Auditorium",       address: "77 Innovation Way, Springfield, IL 62703", capacity: 500 },
        { name: "City Library – Room A",     address: "9 Elm St, Springfield, IL 62704", capacity: 80  },
        { name: "Eastside Sports Complex",   address: "220 Fieldhouse Dr, Springfield, IL 62705", capacity: 1000 }
    ],

    events: [
        {
            name: "Community Meetup Night",
            start_date: "2025-10-10T23:00:00Z",
            end_date:   "2025-10-11T01:00:00Z",
            locationName: "Downtown Community Center",
            description: "Monthly community networking with snacks and lightning talks."
        },
        {
            name: "Riverside Morning Yoga",
            start_date: "2025-10-12T12:30:00Z",
            end_date:   "2025-10-12T13:30:00Z",
            locationName: "Riverside Park Pavilion",
            description: "All levels welcome. Bring your own mat."
        },
        {
            name: "Tech Careers Fair",
            start_date: "2025-10-18T14:00:00Z",
            end_date:   "2025-10-18T20:00:00Z",
            locationName: "Tech Hub Auditorium",
            description: "Local startups and enterprises hiring for software roles."
        },
        {
            name: "Author Talk: Writing Mystery",
            start_date: "2025-10-20T23:00:00Z",
            end_date:   "2025-10-21T00:30:00Z",
            locationName: "City Library – Room A",
            description: "Q&A and signing with award-winning mystery novelist."
        },
        {
            name: "Indoor Soccer Tournament",
            start_date: "2025-10-25T14:00:00Z",
            end_date:   "2025-10-25T22:00:00Z",
            locationName: "Eastside Sports Complex",
            description: "Youth and adult brackets; team registration required."
        }
    ]
};
