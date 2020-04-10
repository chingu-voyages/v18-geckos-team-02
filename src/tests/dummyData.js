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
        file: 'A note of sorts',
        timeStamps: {
            created: someDateTime,
            modified: someDateTime,
            user: someDateTime
        },
        activeTimeStamp: 'created',
        tags: ['noteTest1']
    }
]