import { Form, Input, Button, FormGroup, Row, Col, Label } from 'reactstrap';
import { Link } from "react-router-dom";
import { useAppContext } from "./appcontext";
import BootstrapTable from'react-bootstrap-table-next';
import { useEffect, useState } from "react";
import { FileFullOrFolderFullOrWebLink } from "box-typescript-sdk-gen/lib/schemas/fileFullOrFolderFullOrWebLink.generated";
import { Items } from "box-typescript-sdk-gen/lib/schemas/items.generated";
import { GetFileMetadataByIdScope } from "box-typescript-sdk-gen/lib/managers/fileMetadata.generated";
import { MetadataFull } from "box-typescript-sdk-gen/lib/schemas/metadataFull.generated";
import { useNavigate } from "react-router-dom";
import { isClickableInput } from '@testing-library/user-event/dist/utils';
import { UploadFileRequestBody, UploadFileRequestBodyAttributesField } from 'box-typescript-sdk-gen/lib/managers/uploads.generated';
import { Files } from 'box-typescript-sdk-gen/lib/schemas/files.generated';

export default function PortalPage() {

    type event = {
        id?: string;
        name?: string;
        status?: string;
    }

    const appContent = useAppContext();
    const [folders, setFolders] = useState<any>([]);
    const [event, setEvent] = useState<event>({});
    const [fileSelected, setFileSelected] = useState<{}>({disabled: true});
    const [file, setFile] = useState<File | undefined>(undefined);
    const [fileType, setFileType] = useState<string>('');
    const navigate = useNavigate();
    const [refreshTable, setRefreshTable] = useState<boolean>(false);

    useEffect(() => {
        console.log("Getting folders...");
        const getFolders = async () => {
            console.log("Getting folders...");
            if (!appContent.session?.boxClient) {
                navigate('/login');
            }
            else 
            {
                try {
                    const folders = await appContent.session.boxClient.search.searchForContent({
                        query: 'EventOne',
                        type: 'folder'
                        }
                    );
                    const folderItems= folders?.entries || [];
                    if (folderItems.length === 0) {
                        console.log('No folder items');
                        setFolders([]);
                    }
                    if (folderItems.length === 0) {
                        console.log('No folder items');
                        setFolders([]);
                    }
                    const folderItem = folderItems[0] as FileFullOrFolderFullOrWebLink;
                    console.log('Folder item:', folderItem);
                    setEvent({
                        id: folderItem.id,
                        name: folderItem.name,
                        }
                    );
                    const items = await appContent.session.boxClient.folders.getFolderItems(folderItem.id) as Items;
                    if (items.entries) {
                        let data = [];
                        for (let entry of items.entries as FileFullOrFolderFullOrWebLink[]) {
                            try {
                                const fileData = await appContent.session.boxClient.fileMetadata.getFileMetadataById(
                                    entry.id,
                                    'enterprise' as GetFileMetadataByIdScope,
                                    'eventSubmissionDocument'
                                ) as MetadataFull;
                                data.push({
                                    name: entry.name,
                                    type: fileData.extraData?.documentType || 'Unknown',
                                    status: fileData.extraData?.submissionStatus || 'Unknown'
                                })
                            }
                            catch (error) {
                                data.push({
                                    name: entry.name,
                                    type: 'Unknown',
                                    status: 'Unknown'
                                })
                            }
                        };
                        console.log('Data:', data);
                        setFolders(data);
                    }
                    else {
                        console.log('No folder items');
                        setFolders([]);
                    }
                }
                catch (error) {
                    console.error('Error getting folders:', error);
                    navigate('/login');
                }
            }
        };
        getFolders();
    },[refreshTable]);

    function handleFileSelected(event: React.ChangeEvent<HTMLInputElement>) {
        setFileSelected({});
        setFile(event.target.files?.[0] as File);
    }

    function handleFileTypeSelected(event: React.ChangeEvent<HTMLInputElement>) {
        setFileType(event.target.value);
    }

    async function uploadFile(btnEvent: React.FormEvent<HTMLFormElement>) {
        btnEvent?.preventDefault();
        const boxClient = appContent.session?.boxClient;
        if (!boxClient) {
            navigate('/login');
        }
        else if (!file) {
            console.error('No file selected');
        }
        else {
            try {
                let formData: FormData = new FormData();
                const attrs = {
                    name: file.name,
                    parent: {id: event.id},
                };
                formData.append('attributes', JSON.stringify(attrs))
                formData.append('file', file);
                const boxToken = await boxClient.auth.retrieveAuthorizationHeader();
                console.log('Box token:', boxToken);
                console.log('Form data:', formData);
                const boxFile = await fetch('https://upload.box.com/api/2.0/files/content', {
                    method: 'POST',
                    headers: { 
                        'Authorization': `${boxToken}`,
                    },
                    body: formData,
                    mode: 'cors'
                });
                const newFileData: Files = await boxFile.json();
                const fileId = newFileData.entries?.[0].id || '';
                await boxClient.fileMetadata.createFileMetadataById(
                    fileId,
                    'enterprise' as GetFileMetadataByIdScope,
                    'eventSubmissionDocument',
                    {
                        documentType: "Event Plan",
                        submissionStatus: "Submitted"
                    }
                );
                console.log('Box file:', newFileData);
            }
            catch (error) {
                console.error('Error uploading file:', error);
            }
            setRefreshTable(!refreshTable);
        }

    }

    const columns = [{
        dataField: 'name',
        text: 'File Name'
      }, {
        dataField: 'type',
        text: 'Document Type'
      }, {
        dataField: 'status',
        text: 'Submission Status'
      }];

    if (appContent.session.loggedIn) {
        return (
            <div>
                <div className="row">
                    <div className="col">
                        <p><b>Event Name:</b> {event.name}</p>
                    </div>
                    <div className="col">
                        <p><b>Event Status:</b> {event.status}</p>
                    </div>
                </div>
                <div className="row">
                    <Form onSubmit={uploadFile}>
                        <Row className="row-cols-lg-auto g-3 align-items-center" style={{ height: '100wh'}}>
                            <Col>
                                <Input type="file" name="file" id="file" onChange={handleFileSelected}/>
                            </Col>
                            <Col>
                                <Input type="select" name="type" id="Type" placeholder="Select">
                                    <option>Event Plan</option>
                                    <option>Insurance Certificate</option>
                                </Input>
                            </Col>
                            <Col>
                               <Button type="submit" {...fileSelected}>Upload</Button>
                            </Col>
                        </Row>
                    </Form>
                </div>
                <div className="row">
                    <BootstrapTable keyField='name' data={ folders } columns={ columns } bordered={ false } />
                </div>
            </div>
        );
    }
    else {
        return (
            <div>
                <p>On this page details will be shown once yoi are logged in</p>
                <p>Click <Link to="/login">here</Link> to login.</p>
            </div>
        );
    }
};
