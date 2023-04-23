// ------------- ENABLE SEARCH BUTTON WHEN INPUT HAS VALUE -------------
const search_input = document.getElementById('search_input');
const search_button = document.getElementById('search_button');

search_input.addEventListener('input', function(){
    if(this.value.trim().length > 0){
        search_button.disabled = false;
    }else {
        search_button.disabled = true;
    }
});
// ---------------------------------------------------------------------