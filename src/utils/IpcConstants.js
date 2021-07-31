 const ipcConstants = {
    'OPEN_MODEL_WINDOW': 'model_window:open',

     'MODEL_SEND_TO_DIVES': 'model:send_to_dives',
     'MODEL_SET_CENTER': 'model:set_center',
     'MODEL_SET_START_TIME': 'model:set_start_time',
     'MODEL_SET_EXTENTS': 'model:set_extents',
     'MODEL_SET_ALL': 'model:set_all',

     'GET_STORE_VAL': 'getStoreValue',
     'SET_STORE_VAL': 'setStoreValue',

     // All the model data
     'MODEL_DATA_KEY': 'modelData',
     // Model name
     'SELECTED_MODEL_KEY': 'selectedModel',

}


 module.exports = {
     ipcConstants: ipcConstants
 };