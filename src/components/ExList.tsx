import { Add, Checkbox, FormClose } from 'grommet-icons';
import { Box, Button, CheckBox, DataTable, NameValueList, SelectMultiple, Text, TextInput } from 'grommet';
import { ChangeEvent, ReactHTMLElement, useCallback, useEffect, useMemo, useRef, useState } from 'react';

//@ts-ignore

type Item = {
    id: string,
    label: string,
    value: boolean,
}
type ExListProps = {
    data?: {
        id: string,
        name: string,
        items: Item[]
    } | undefined
}
enum FilterTag {
    ALL = "all",
    ORIGINAL = "original",
    NEW = "new",
    SELECTED = "selected",
    UNSELECTED = "unselected",
    DONE = "done"
}
type TagsState = {
    [key: Item["id"]]: Set<FilterTag>
}

const ExList = ({ data }: ExListProps) => {

    const list = useMemo(() => (data || {
        "id": "list-uuid-1",
        "name": "My list name",
        "items": [
            { "id": "uuid-1", label: "item 1", value: true },
            { "id": "uuid-2", label: "item 1", value: false },
            { "id": "uuid-3", label: "item 1", value: true }
        ]
    }), [data])

    const [items, setItems] = useState(list.items)
    const [tags, setTags] = useState({} as TagsState)
    const [selectedTags, setSelectedTags] = useState([FilterTag.ALL]);
    const filteredItems = useMemo(() => items.filter(item =>
        selectedTags.reduce((visibility, tag) =>
            (tags[item.id] && (tags[item.id].has(tag)) && visibility), true))
        , [items, tags, selectedTags])
    const [checked, setChecked] = useState([] as string[]);
    const [done, setDone] = useState([] as string[])
    const [newItem, setNewItem] = useState({} as Item)


    const checkBoxRefs = useRef({} as {
        [key: Item["id"]]: HTMLInputElement
    })
    const getSetWithout = (set: Set<any>, toDelete: any[]) => {
        set = new Set(set); toDelete.map(v => set.delete(v)); return set
    }

    useEffect(() => {
        setTags(
            items.reduce(
                (obj, item) => ({
                    ...obj,
                    [item.id]: new Set([FilterTag.ALL, FilterTag.ORIGINAL, item.value ? FilterTag.SELECTED : FilterTag.UNSELECTED],
                    )
                })
                , {})
        )
    }, [items])

    useEffect(() => {
        setChecked([...items.filter(obj => obj.value === true).map(obj => obj.id)])
    }, [items])


    const onCheck = useCallback(
        (checkedStutus: boolean, value: string) => {
            console.log("check trigger")
            if (done.includes(value)) return
            if (checkedStutus) {
                setChecked([...checked, value]);
                setTags({
                    ...tags,
                    [`${value}`]: new Set([
                        ...getSetWithout(
                            new Set(tags[`${value}`]),
                            [FilterTag.UNSELECTED]),
                        FilterTag.SELECTED])
                    // new Set(...getSetWithout(tags[`${value}`], [FilterTag.UNSELECTED]), ...[FilterTag.SELECTED])
                })
            } else {
                setChecked(checked.filter((item) => item !== value));
                setTags({
                    ...tags,
                    [`${value}`]: new Set([...getSetWithout(new Set(tags[`${value}`]), [FilterTag.SELECTED]), FilterTag.UNSELECTED])
                })
            }
        }, [checked, done, tags])

    const onDone = useCallback(
        (event: ChangeEvent<HTMLInputElement>, id: string) => {
            if (Boolean(event.target.checked)) {
                setDone([...done, id]);
                setTags({
                    ...tags,
                    [`${id}`]: new Set([...tags[`${id}`], FilterTag.DONE])
                })
            } else {
                setDone(done.filter((item) => item !== id));
                setTags({
                    ...tags,
                    [`${id}`]: getSetWithout(new Set(tags[`${id}`]), [FilterTag.DONE])
                })
            }
        }, [done, tags])

    const AddBtn = useMemo(() => (
        <Box align='center' direction='row' pad="small" >
            <Box round="full" overflow="hidden" >
                <Button primary size='small' icon={<Add />} onClick={
                    _e => {
                        const id = `uuid-${items.length + 1}`
                        setItems([...items, {
                            ...newItem, id
                        }])
                        setTags({
                            ...tags,
                            [`${id}`]: new Set([
                                FilterTag.ALL,
                                FilterTag.NEW,
                                FilterTag.SELECTED
                            ])
                        })
                    }
                } />
            </Box>
        </Box>
    ), [items, newItem, tags])


    const onRemoveSelection = (deleteOption: string) => setSelectedTags(selectedTags.filter((option) => deleteOption !== option || deleteOption === FilterTag.ALL));

    const renderChip = (selection: string) => (
        <Button
            key={`chip-${selection}`
            }
            onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onRemoveSelection(selection);
            }}
            onFocus={(event) => event.stopPropagation()}
        >
            < Box
                align="center"
                direction="row"
                gap="xsmall"
                pad={{ vertical: 'xsmall', horizontal: 'small' }}
                margin="xsmall"
                background="light-3"
                round="large"
            >
                < Text size="small" > {selection}</Text >
                < Box round="full" margin={{ left: 'xsmall' }}>
                    < FormClose size="small" style={{ width: '12px', height: '12px' }} />
                </Box >
            </Box >
        </Button >
    )

    return (
        <>
            <Box pad="small" align='center' direction='row' justify={'between'} >
                <Text
                    style={{ width: "15%" }}
                >{" Filters: "}</Text>
                <SelectMultiple
                    style={{ flexGrow: 3, minHeight: "40px" }}
                    valueLabel={option => (
                        <Box wrap direction="row" width="medium">{
                            option.map((i: string) =>
                                renderChip(i)
                            )
                        }</Box>
                    )}
                    options={Object.values(FilterTag)}
                    value={selectedTags}
                    onChange={({ value }: { value: FilterTag[] }) => {
                        if (!value.includes(FilterTag.ALL)) value.unshift(FilterTag.ALL)
                        setSelectedTags([...value]);

                    }}
                />

            </Box>
            <DataTable
                columns={[
                    {
                        property: "id",
                        size: "20%",
                        align: "center",
                        header: (
                            <Text>{"uuid"}</Text>
                        )
                    },
                    {
                        property: "checkbox",
                        size: "5%",
                        render: ({ id }) => typeof id === "string" ? (
                            <CheckBox
                                key={id}
                                ref={element => { if (element !== null) checkBoxRefs.current[id] = element }}
                                checked={checked.indexOf(id) !== -1}
                                onChange={(e) => { onCheck(e.target.checked, id) }}

                            />
                        ) : (
                            <CheckBox disabled checked />
                        ),
                        header: (
                            <CheckBox
                                onChange={ e => {
                                    for (let checkbox of Object.values(checkBoxRefs.current)) {
                                        let el = checkbox;
                                        el.setAttribute("checked", e.target.value); // Just a small change as value will most of the time be a string (even for type="number" input);
                                        el.dispatchEvent(new Event("change", { bubbles: true }));
                                    }
                                }
                                }
                            />
                        ),
                        sortable: false,
                    },
                    {
                        property: "label",
                        render: ({ id, label }) =>
                            typeof id === "string" ?
                                done.includes(id) ?
                                    (<Text
                                        style={{
                                            backgroundColor: "black",
                                            borderRadius: "10px",
                                            paddingLeft: "10px"
                                        }}
                                    >{label}</Text>) :
                                    (<Text>{label}</Text>) :
                                (<TextInput
                                    onChange={(e) => {
                                        setNewItem({
                                            id: "",
                                            label: e.target.value,
                                            value: true
                                        })

                                    }}
                                />),

                        header: "Task"
                    },
                    {
                        property: "done",
                        size: "5%",
                        render: ({ id }) => (
                            typeof id === "string" ?
                                (<CheckBox
                                    key={id}
                                    checked={done.indexOf(id) !== -1}
                                    onChange={(e) => { onDone(e, id) }}
                                />) :
                                <CheckBox disabled checked={false} />
                        ),
                        sortable: false,
                        header: (<Text>{"Done"}</Text>),
                        align: "center"
                    },
                ]}
                data={
                    [
                        {
                            id: AddBtn,
                            label: "",
                            value: true
                        },
                        ...filteredItems
                    ]

                }
            />
        </>

    )
}
export { ExList }