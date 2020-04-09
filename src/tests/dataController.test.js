import { listNodes, getFiles, setFile, updateFile, removeFile, formatDate } from '../dataController';
import dummyData from './dummyData';
const dummyFileObjs = dummyData;

test('formatDate()', () => {
    expect(formatDate(1586427391156)).toEqual("20200409111631");
});

test('setFile()', () => {
    expect(setFile(dummyFileObjs[1])).toBe(true);
    expect(setFile(dummyFileObjs[2])).toBe(true);
});

test('getFiles()', () => {
    expect(getFiles()).toEqual([]);
    expect(getFiles("2020","2020")).toEqual([
        {...dummyFileObjs[1], "key": "20200409111631"},
        {...dummyFileObjs[2], "key": "20200409111631(1)"}
    ]);
});

test('listNodes()', () => {
    expect(listNodes()).toEqual({});
    expect(listNodes("2020","2020")).toEqual({
        "2020": {
            "04": {
                "09": {
                    "11":{ 
                        "16": [
                            {...dummyFileObjs[1], "key": "20200409111631"},
                            {...dummyFileObjs[2], "key": "20200409111631(1)"}
                        ]
                    }
                }
            }
        }
    });
});

test('updateFile()', () => {
    expect(updateFile({key: 'none'})).toBe('Error: no such file under key: none');
    expect(updateFile({...dummyFileObjs[2], "key": "20200409111631(1)", tags: ['test1', 'test2', 'test3']})).toBe(true);
    expect(getFiles("2020","2020")[1].tags).toEqual([
        "test1",
        "test2",
        "test3",
    ]);
});

test('removeFile()', () => {
    expect(removeFile({key: 'none'})).toBe('Error: no such file under key: none');
    expect(removeFile({key: '20200409111631(1)'})).toBe(true);
    expect(getFiles("2020","2020").length).toBe(1);
});