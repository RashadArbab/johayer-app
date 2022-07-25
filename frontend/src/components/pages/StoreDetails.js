import { React, useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import StoreService from '../../services/StoreService';

function StoreDetails() {
  //allows us to find storeId in parameters
  const { storeId } = useParams();
  //allows us to redirect to different pages
  let navigate = useNavigate();

  const initialStoreState = {
    name: '',
    url: '',
    access_token: '',
    storeId: '',
    address: '',
  };
  //creating store array to reference store
  const [store, setStore] = useState(initialStoreState);
  //creating message array for updating store
  const [message, setMessage] = useState('');
  //creating errors array to hold errors
  const [storeFormErrors, setStoreFormErrors] = useState([]);

  function getStore(storeId) {
    StoreService.get(storeId)
      .then((res) => {
        setStore(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    if (storeId) {
      getStore(storeId);
    }
  }, [storeId]);

  //https://dev.to/alecgrey/controlled-forms-with-front-and-backend-validations-using-react-bootstrap-5a2
  const handleInputChange = (field, value) => {
    setStore({
      ...store,
      [field]: value,
    });
    // Check and see if errors exist, and remove them from the error object:
    if (!!storeFormErrors[field])
      setStoreFormErrors({
        ...storeFormErrors,
        [field]: null,
      });
  };

  const findStoreFormErrors = () => {
    const { name, url, access_token, storeId, address } = store;
    const newErrors = {};
    // name errors
    if (!name || name === '') newErrors.name = 'cannot be blank!';
    else if (name.length > 30) newErrors.name = 'name is too long!';
    // url errors
    if (!url || url === '') newErrors.url = 'cannot be blank!';
    // access_token errors
    if (!access_token || access_token === '')
      newErrors.access_token = 'cannot be blank!';
    // storeId errors
    if (!storeId || storeId === '') newErrors.storeId = 'cannot be blank!';
    else if (storeId.length > 30) newErrors.storeId = 'storeId is too long!';

    return newErrors;
  };

  //when updating, run this function
  function updateStore(e) {
    //prevents reloads after clicking submit
    e.preventDefault();
    // get our new errors
    const newErrors = findStoreFormErrors();
    // Conditional logic:
    if (Object.keys(newErrors).length > 0) {
      // We got errors!
      setStoreFormErrors(newErrors);
    } else {
      StoreService.update(store.storeId, store)
        .then((res) => {
          console.log(res.data);
          setMessage('Store was updated successfully!');
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  //when delting, run this function
  function deleteStore(e) {
    //prevents reloads after clicking submit
    e.preventDefault();
    StoreService.delete(store.storeId)
      .then((res) => {
        console.log(res.data);
        navigate('/stores');
        setMessage('Store was deleted successfully!');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className="container">
      <Form>
        {/* Form Group for Store Name, apply comments throughout other form groups */}
        <Form.Group className="mb-3">
          {/* Label in user interface */}
          <Form.Label>Store Name</Form.Label>
          {/* Attributes of form */}
          <Form.Control
            required
            type="text"
            placeholder="Store Name"
            value={store.name}
            name="name"
            id="name"
            // when form is being written in, the handleInputChange function is called for the specific
            onChange={(e) => handleInputChange('name', e.target.value)}
            //isInvalid property of Form that checks to alert user if there are any errors present
            isInvalid={!!storeFormErrors.name}
          />
          {/* alert user of specific form errors */}
          <Form.Control.Feedback type="invalid">
            {storeFormErrors.name}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Store URL</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="what comes before .myshopify.com"
            value={store.url}
            name="url"
            id="url"
            onChange={(e) => handleInputChange('url', e.target.value)}
            isInvalid={!!storeFormErrors.url}
          />
          <Form.Control.Feedback type="invalid">
            {storeFormErrors.url}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Store Access Token</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Store access token"
            value={store.access_token}
            name="access_token"
            id="access_token"
            onChange={(e) => handleInputChange('access_token', e.target.value)}
            isInvalid={!!storeFormErrors.access_token}
          />
          <Form.Control.Feedback type="invalid">
            {storeFormErrors.access_token}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>
            {' '}
            Store ID (used to access store in this application)
          </Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Perhaps your store name?"
            value={store.storeId}
            name="storeId"
            id="storeId"
            onChange={(e) => handleInputChange('storeId', e.target.value)}
            isInvalid={!!storeFormErrors.storeId}
          />
          <Form.Control.Feedback type="invalid">
            {storeFormErrors.storeId}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Address"
            value={store.address}
            name="address"
            id="address"
            onChange={(e) => handleInputChange('address', e.target.value)}
            isInvalid={!!storeFormErrors.address}
          />
          <Form.Control.Feedback type="invalid">
            {storeFormErrors.address}
          </Form.Control.Feedback>
        </Form.Group>
        <div className="buttons">
          <Button variant="danger" type="button" onClick={deleteStore}>
            Delete
          </Button>
          <Button variant="info" type="button" onClick={updateStore}>
            Update
          </Button>
          <p>{message}</p>
          <a href="/stores" className="btn btn-success">
            Back to Stores
          </a>
          <a
            href={'/stores/' + store.storeId + '/products'}
            className="btn btn-warning"
          >
            View Store's Products{' '}
          </a>
        </div>
      </Form>
    </div>
  );
}
export default StoreDetails;
