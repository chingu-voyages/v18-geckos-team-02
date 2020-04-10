import { listNodes, getFiles, addFiles, updateFile, removeFile} from '../services/dataController';
import dummyData from './dummyData';

const expectedDateKey = '20141013111300';

test('addFiles()', () => {
    expect(addFiles([...dummyData])).toBe(true);
});

test('getFiles()', () => {
    expect(getFiles()).toEqual([]);
    expect(getFiles("2014","2014").map(obj => obj.key)).toEqual([
        '20141013111300',
        '20141013111300(1)'
    ]);
});

test('listNodes()', () => {
    expect(listNodes()).toEqual({});
    expect(listNodes("2014","2014")).toEqual({
        "2014": {
            "10": {
                "13": expect.any(Array)
            }
        }
    });
});

test('updateFile()', () => {
    expect(updateFile({key: 'none'})).toBe('Error: no such file under key: none');
    expect(updateFile({...dummyData[2], "key": expectedDateKey+"(1)", tags: ['test1', 'test2', 'test3']})).toBe(true);
    expect(getFiles("2014","2014")[1].tags).toEqual([
        "test1",
        "test2",
        "test3",
    ]);
});

test('removeFile()', () => {
    expect(removeFile({key: 'none'})).toBe('Error: no such file under key: none');
    expect(removeFile({key: expectedDateKey+'(1)'})).toBe(true);
    expect(getFiles("2014","2014").length).toBe(1);
});
