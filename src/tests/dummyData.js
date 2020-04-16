const someDateTime = 'October 13, 2014 11:13:00';
const someFile = new File(['not much here'], 'file1');
export default [
    {
        file: someFile,
        timeStamps: {
            created: someDateTime,
            modified: someDateTime,
            user: someDateTime
        },
        activeTimeStamp: 'created',
        tags: ['fileTest1']
    },
    {
        file: {name: "a note", text: "A note of sorts", type: "note"},
        timeStamps: {
            created: someDateTime,
            modified: someDateTime,
            user: someDateTime
        },
        activeTimeStamp: 'created',
        tags: ['noteTest1']
    },
    {
        file: {name: "a note", text: "A note of sorts", type: "note"},
        timeStamps: {
            created: 'October 14, 2014 11:13:00',
            modified: someDateTime,
            user: someDateTime
        },
        activeTimeStamp: 'created',
        tags: ['noteTest1']
    },
    {
        file: {name: "a note", text: "A note of sorts", type: "note"},
        timeStamps: {
            created: 'October 18, 2014 11:13:00',
            modified: someDateTime,
            user: someDateTime
        },
        activeTimeStamp: 'created',
        tags: ['noteTest1']
    },
    {
        file: {name: "a note", text: "A note of sorts", type: "note"},
        timeStamps: {
            created: 'October 3, 2014 11:13:00',
            modified: someDateTime,
            user: someDateTime
        },
        activeTimeStamp: 'created',
        tags: ['noteTest1']
    },{
        file: {name: "a note", text: "A note of sorts", type: "note"},
        timeStamps: {
            created: 'October 27, 2014 11:13:00',
            modified: someDateTime,
            user: someDateTime
        },
        activeTimeStamp: 'created',
        tags: ['noteTest1']
    },{
        file: {name: "a note", text: "A note of sorts", type: "note"},
        timeStamps: {
            created: 'October 27, 2014 11:13:00',
            modified: someDateTime,
            user: someDateTime
        },
        activeTimeStamp: 'created',
        tags: ['noteTest1']
    },{
        file: {name: "a note", text: "A note of sorts", type: "note"},
        timeStamps: {
            created: 'October 27, 2014 11:13:00',
            modified: someDateTime,
            user: someDateTime
        },
        activeTimeStamp: 'created',
        tags: ['noteTest1']
    },{
        file: {name: "a note", text: "A note of sorts", type: "note"},
        timeStamps: {
            created: 'December 14, 2014 11:13:00',
            modified: someDateTime,
            user: someDateTime
        },
        activeTimeStamp: 'created',
        tags: ['noteTest1']
    },
    {
        file: {name: "a note", text: "A note of sorts", type: "note"},
        timeStamps: {
            created: 'December 18, 2014 11:13:00',
            modified: someDateTime,
            user: someDateTime
        },
        activeTimeStamp: 'created',
        tags: ['noteTest1']
    },{
        file: {name: "a note", text: "A note of sorts", type: "note"},
        timeStamps: {
            created: 'December 19, 2014 11:13:00',
            modified: someDateTime,
            user: someDateTime
        },
        activeTimeStamp: 'created',
        tags: ['noteTest1']
    },{
        file: {name: "a note", text: "A note of sorts", type: "note"},
        timeStamps: {
            created: 'December 3, 2014 11:13:00',
            modified: someDateTime,
            user: someDateTime
        },
        activeTimeStamp: 'created',
        tags: ['noteTest1']
    },
]
