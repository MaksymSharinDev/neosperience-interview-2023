import { Add, FormClose } from 'grommet-icons';
import { Box, Button, CheckBox, DataTable, SelectMultiple, Text, TextInput } from 'grommet';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';

//@ts-ignore

type Item = {
    id: string,
    label: string,
    value: boolean
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
    const itemsIds = useMemo(() => items.map((obj) => obj.id), [items])
    const isOriginal = useCallback((id: Item["id"]) => items.filter(() => list?.items.map(item => item.id).includes(id)), [items, list])
    const isNew = useCallback((id: Item["id"]) => !isOriginal(id), [isOriginal])

    const [checked, setChecked] = useState([] as Item["id"][]);
    const isChecked = useCallback((id: Item["id"]) => checked.includes(id), [checked])
    const isUnchecked = useCallback((id: Item["id"]) => !isChecked(id), [isChecked])
    const checkedExclude = useCallback((id: Item["id"]) => checked.filter((checkedItemId) => checkedItemId !== id), [checked])

    const [done, setDone] = useState([] as Item["id"][])
    const isDone = useCallback((id: Item["id"]) => done.includes(id), [done])
    const doneExclude = useCallback((id: Item["id"]) => done.filter((doneItemId) => doneItemId !== id), [done])

    const [newItem, setNewItem] = useState({} as Item)

    const [selectedFilter, setSelectedFilter] = useState([FilterTag.ALL]);
    const onDeselectFilter = useCallback((filterToDisable: string) => {
        if (filterToDisable !== FilterTag.ALL) {
            setSelectedFilter(
                selectedFilter.filter((itemFilter) =>
                    filterToDisable !== itemFilter
                )
            )
        }
    }, [selectedFilter])

    useEffect(() => {
        const selectedItems = items.filter(item => item.value === true).map(item => item.id)
        setChecked(selectedItems)
    }, [items])

    const onCheck = useCallback(
        (checkedStutus: boolean, id: string) => {
            if (isDone(id)) return
            if (checkedStutus) {
                setChecked([...checked, id]);
            } else {
                setChecked(checkedExclude(id));
            }
        }, [checked, checkedExclude, isDone])

    const onCheckAll = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            if (event.target.checked) {
                setChecked(
                    itemsIds.filter(id => !(isDone(id) && !isChecked(id))))
            } else {
                setChecked(itemsIds.filter(id => isDone(id) && isChecked(id)))
            }

        }, [isChecked, isDone, itemsIds])

    const onDone = useCallback(
        (event: ChangeEvent<HTMLInputElement>, id: string) => {
            if (Boolean(event.target.checked)) {
                setDone([...done, id]);
            } else {
                setDone(doneExclude(id));
            }
        }, [done, doneExclude])

    const compatibleFilters = useMemo(() => {
        const filters: FilterTag[] = Object.values(FilterTag)
        let compatibleFilters = filters as FilterTag[]
        if (selectedFilter.length === 0) {
            setSelectedFilter([FilterTag.ALL])
            compatibleFilters = filters.filter(tag => tag !== FilterTag.ALL)
        }
        if (selectedFilter.includes(FilterTag.ALL) && selectedFilter.length === 1) {
            compatibleFilters = filters.filter(tag => tag !== FilterTag.ALL)
        } else if (selectedFilter.includes(FilterTag.ALL) && selectedFilter.length > 1) {
            setSelectedFilter([FilterTag.ALL])
            compatibleFilters = filters.filter(tag => tag !== FilterTag.ALL)
        }
        if (selectedFilter.includes(FilterTag.DONE)) { }
        if (selectedFilter.includes(FilterTag.ORIGINAL)) {
            compatibleFilters = compatibleFilters.filter(tag => tag !== FilterTag.NEW)
        } else
            if (selectedFilter.includes(FilterTag.NEW)) {
                if (selectedFilter.includes(FilterTag.ORIGINAL)) {
                    setSelectedFilter(selectedFilter.filter(tag => tag !== FilterTag.NEW))
                    return compatibleFilters
                }
                compatibleFilters = compatibleFilters.filter(tag => tag !== FilterTag.ORIGINAL)
            }
        if (selectedFilter.includes(FilterTag.SELECTED)) {
            compatibleFilters = compatibleFilters.filter(tag => tag !== FilterTag.UNSELECTED)
        } else
            if (selectedFilter.includes(FilterTag.UNSELECTED)) {
                if (selectedFilter.includes(FilterTag.SELECTED)) {
                    setSelectedFilter(selectedFilter.filter(tag => tag !== FilterTag.UNSELECTED))
                    return compatibleFilters
                }
                compatibleFilters = compatibleFilters.filter(tag => tag !== FilterTag.SELECTED)
            }
        console.log(compatibleFilters)
        return compatibleFilters
    }, [selectedFilter])

    const getFilteredItems = useCallback(() => {
        let filteredItems: Item[] = items
        selectedFilter.forEach(filter => {
            switch (filter) {
                case FilterTag.ALL: break;
                case FilterTag.DONE:
                    filteredItems = filteredItems.filter(item => isDone(item.id))
                    break;
                case FilterTag.ORIGINAL:
                    filteredItems = filteredItems.filter(item => isOriginal(item.id))
                    break;
                case FilterTag.NEW:
                    filteredItems = filteredItems.filter(item => isNew(item.id))
                    break;
                case FilterTag.SELECTED:
                    filteredItems = filteredItems.filter(item => isChecked(item.id))
                    break;
                case FilterTag.UNSELECTED:
                    filteredItems = filteredItems.filter(item => isUnchecked(item.id))
                    break;

            }
        })
        return filteredItems
    }, [items, selectedFilter, isOriginal, isNew, isChecked, isUnchecked, isDone])

    const AddBtn = useMemo(() => (
        <Box align='center' direction='row' pad="small" >
            <Box round="full" overflow="hidden" >
                <Button primary size='small' icon={<Add />} onClick={
                    _e => {
                        setItems([...items, {
                            ...newItem,
                            id: `uuid-${items.length + 1}`
                        }])
                    }
                } />
            </Box>
        </Box>
    ), [items, newItem])

    const renderChip = useCallback((selection: string) => (
        <Button
            key={`chip-${selection}`
            }
            onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onDeselectFilter(selection);
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
    ), [onDeselectFilter])

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
                                [...compatibleFilters, FilterTag.ALL].includes(i as FilterTag) && renderChip(i)
                            )
                        }</Box>
                    )}
                    options={compatibleFilters}
                    value={selectedFilter}
                    onChange={({ value }: {
                        value: FilterTag[]
                    }) => {
                        setSelectedFilter([...value]);
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
                        header: (
                            <CheckBox
                                onChange={onCheckAll}
                            />
                        ),
                        render: ({ id }) =>
                            typeof id === "string" ? (
                                <CheckBox
                                    key={id}
                                    checked={isChecked(id)}
                                    onChange={(e) => { onCheck(e.target.checked, id) }}
                                />
                            ) : (
                                <CheckBox disabled checked />
                            ),

                        sortable: false,
                    },
                    {
                        property: "label",
                        header: <Text>{"Task"}</Text>,
                        render: ({ id, label }) =>
                            typeof id === "string" ?
                                isDone(id) ?
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
                                            ...newItem,
                                            label: e.target.value,
                                            value: true
                                        })
                                    }}
                                />)
                    },
                    {
                        property: "done",
                        size: "5%",
                        header: (<Text>{"Done"}</Text>),
                        render: ({ id }) => (
                            typeof id === "string" ?
                                (<CheckBox
                                    key={id}
                                    checked={isDone(id)}
                                    onChange={(e) => { onDone(e, id) }}
                                />) :
                                <CheckBox disabled checked={false} />
                        ),
                        sortable: false,
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
                        ...getFilteredItems()
                    ]

                }
            />
        </>

    )
}
export { ExList }