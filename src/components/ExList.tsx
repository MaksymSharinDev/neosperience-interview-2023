import { Add, FormClose } from 'grommet-icons'
import { Box, Button, CheckBox, DataTable, NameValueList, SelectMultiple, Text, TextInput } from 'grommet';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';

//@ts-ignore

type Item = {
    id: string,
    label: string,
    value: boolean,
    tags?: string[]
}
type ExListProps = {
    data?: {
        id: string,
        name: string,
        items: Item[]
    } | undefined
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
    const [checked, setChecked] = useState([] as string[]);
    const [done, setDone] = useState([] as string[])
    const [newItem, setNewItem] = useState({} as Item)

    useEffect(() => {
        setChecked([...items.filter(obj => obj.value === true).map(obj => obj.id)])
        setItems([...items.map(
            item => ({ ...item, tags: ["all", "original"] })
        )])
        // setOriginal(items.map(obj => obj.id))
    }, [])

    const onCheck = useCallback(
        (checkedStutus: boolean, value: string) => {
            if (done.includes(value)) return
            if (checkedStutus) {
                setChecked([...checked, value]);
            } else {
                setChecked(checked.filter((item) => item !== value));
            }
        }, [checked, done])

    const onCheckAll =
        (event: ChangeEvent<HTMLInputElement>) => {
            console.log(event.target.checked)
            const ids = items.map((obj) => obj.id)
            if (event.target.checked) {
                setChecked(
                    ids.filter(id => !(done.includes(id) && !checked.includes(id))))
            } else {
                // save done checked
                setChecked(ids.filter(id => done.includes(id) && checked.includes(id)))
            }

        }

    const onDone = useCallback(
        (event: ChangeEvent<HTMLInputElement>, value: string) => {
            if (Boolean(event.target.checked)) {
                setDone([...done, value]);
            } else {
                setDone(done.filter((item) => item !== value));
            }
        }, [done])

    const AddBtn = useMemo(() => (
        <Box align='center' direction='row' pad="small" >
            <Box round="full" overflow="hidden" >
                <Button primary size='small' icon={<Add />} onClick={
                    _e => {
                        setItems([...items, {
                            ...newItem,
                            id: `uuid-${items.length + 1}`,
                            tags: ["all","new", "selected"]
                        }])
                    }
                } />
            </Box>
        </Box>
    ), [items, newItem])

    const [selected, setSelected] = useState(["all"]);
    const onRemoveSelection = (deleteOption: string) => setSelected(selected.filter((option) => deleteOption !== option || deleteOption === "all"));
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
                    width={"80%"}
                    style={{ flexGrow: 3, minHeight: "40px" }}
                    valueLabel={option => (
                        <Box wrap direction="row" width="medium">{
                            option.map((i: string) =>
                                renderChip(i)
                            )
                        }</Box>
                    )}
                    options={['all', 'original', 'new', "selected", "unselected", "done"]}
                    value={selected}
                    onChange={({ value }: { value: string[] }) => {
                        if (!value.includes("all")) value.unshift("all")
                        setSelected([...value]);
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
                                checked={checked.indexOf(id) !== -1}
                                onChange={(e) => { onCheck(e.target.checked, id) }}
                            />
                        ) : (
                            <CheckBox disabled checked />
                        ),
                        header: (
                            <CheckBox
                                onChange={onCheckAll}
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
                        ...items
                    ]

                }
            />
        </>

    )
}
export { ExList }