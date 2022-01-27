import React, { useEffect, useState, useContext, useReducer } from 'react';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';
import { UserContext } from './App';
import { RatingView } from 'react-simple-star-rating';
import { useHistory } from 'react-router-dom';
import DeleteModal from './DeleteModal.js';
import styles from './PaginatedItems.module.css';
//import './PaginatedItems.module.css';


//component that receives currentItems (items we want to display on a single page) and returns items on a single page
function Items({ currentItems }) {

  const [deleteModalOpen, setDeleteModalOpen] = useState({state: false, url: "", redirect: '/products'});
  //user globalna state varijabla koja sadrži objekt (s podatcima o logiranom useru, ako ima koji takav)
  //dispatchUser metoda za update-anje user globalne state varijable
  const { user } = useContext(UserContext);

  const history = useHistory();

  function handleEdit(e, item){
    e.stopPropagation();
    //console.log(`You clicked edit button: ${e.target}, ${item._id}`);
    history.push(`/editProduct/${item._id}`);
  }

  function handleDelete(e, item){
      e.stopPropagation();
      //console.log(`You clicked delete button: ${e.target}, ${item._id}`);
      setDeleteModalOpen({state: true, url: `http://localhost:8080/products/${item._id}`, redirect: '/products'});
  }

  //save windows scrollPositionY on link click (when user clicks on particular product)
  function handleClickLink(){
    sessionStorage.setItem("scrollPositionY", window.scrollY);
  }

  return (
    <>
      {currentItems && <div className={styles.cardWrapper}>{currentItems.map((item)=>{
        return(
          <div className={styles.card} key={item._id}>
              <Link to={`/products/${item._id}`} className={styles.link} onClick={handleClickLink}>
                  {item.images.length!==0 && <img src={item.images[0].url} className={styles.cardImage} alt="productImage"></img>}
                  <p className={styles.title}>{item.title}</p>
                  <p className={styles.location}>({item.location})</p>
                  <div className={styles.ratingViewAndSpan}>
                      <RatingView ratingValue={Math.round(item.avgRating)} size={20} className={styles.ratingView}/>
                      <span className={styles.avgRatingText}>({item.avgRating.toFixed(1)})</span>
                  </div>
                  <p className={styles.description}>{item.description}</p>
                  <p className={styles.seller}>Seller: {item.author.username}</p>
                  <p className={styles.price}>{item.price} €</p>
              </Link>
              {item.author._id === user.id && 
                  <div className={styles.btnWrapper}>
                      <button className={styles.editBtn} onClick={(e)=>{handleEdit(e, item)}}>
                          <span className={styles.editBtnFront}>Edit</span>
                      </button>
                      <button className={styles.deleteBtn} onClick={(e)=>{handleDelete(e, item)}}>
                          <span className={styles.deleteBtnFront}>Delete</span>
                      </button>
                  </div>
              }
          </div>
        )})}
      </div>}
      {deleteModalOpen.state && 
        <div className={styles.modalOverlay}>
            <div className={styles.modalWrapper}>
                <DeleteModal closeModal={[deleteModalOpen, setDeleteModalOpen]} />
            </div>
        </div>
      }
    </>
  );
}

/* ****************** */
  //filter arr by minPrice and maxPrice and return filteredItems
  function filterItems(arr, minPrice, maxPrice){

    if(minPrice === ''){
      minPrice = 0;
    }
    if(maxPrice === ''){
      maxPrice = 32000000;
    }
    const filteredItems = arr.filter((item)=>{
      if(item.price >= parseInt(minPrice) && item.price <= parseInt(maxPrice)){
        return true;
      }else{
        return false;
      }
    });

    return filteredItems;
  }

  //sort arr by sortBy and return sortedItems
  function sortItems(arr, sortBy){
    
    const sortedItems = arr;
    if(sortBy === "price-inc"){
      for(let i=0; i<arr.length-1; i++){
        for(let j=0; j<arr.length-i-1; j++){
          if(arr[j].price > arr[j+1].price){
            let temp = arr[j];
            sortedItems[j] = arr[j+1];
            sortedItems[j+1] = temp;
          }
        }
      }
    }else if(sortBy === "price-dec"){
      for(let i=0; i<arr.length-1; i++){
        for(let j=0; j<arr.length-i-1; j++){
          if(arr[j].price < arr[j+1].price){
            let temp = arr[j];
            sortedItems[j] = arr[j+1];
            sortedItems[j+1] = temp;
          }
        }
      }
    }else if(sortBy === "rating"){
      for(let i=0; i<arr.length-1; i++){
        for(let j=0; j<arr.length-i-1; j++){
          if(arr[j].avgRating < arr[j+1].avgRating){
            let temp = arr[j];
            sortedItems[j] = arr[j+1];
            sortedItems[j+1] = temp;
          }
        }
      }
    }else if(sortBy === "title"){
      for(let i=0; i<arr.length-1; i++){
        for(let j=0; j<arr.length-i-1; j++){
          if(arr[j].title.toLowerCase() > arr[j+1].title.toLowerCase()){
            let temp = arr[j];
            sortedItems[j] = arr[j+1];
            sortedItems[j+1] = temp;
          }
        }
      }
    }
    return sortedItems;
  }

  //filter then sort arr (items) and return filteredAndSorted array
  function filterAndSortItems(items, minPrice, maxPrice, sortBy){
    
    const filteredItems = filterItems(items, minPrice, maxPrice);
    const sortedItems = sortItems(filteredItems, sortBy);

    return sortedItems;
  }

  /* ********************** */
  const initialStateFilter = {minPrice: 0, maxPrice: 32000000, sortBy: ""};
  const reducerFunctionFilter = (currentState, action) => {
    switch (action.type) {
      //update filter state varijable
      case 'minPrice':
        return {...currentState, minPrice: action.data};
      case 'maxPrice':
        return {...currentState, maxPrice: action.data};
      case 'sortBy':
        return {...currentState, sortBy: action.data};
      default:
        return currentState;
    }
  }

//main component that receives all data (items) and number of items per page (itemsPerPage) as a props
function PaginatedItems(props) {

  const items = props.data;
  const itemsPerPage = props.itemsPerPage;

  const [filter, dispatchFilter] = useReducer(reducerFunctionFilter, JSON.parse(sessionStorage.getItem('filter')) || initialStateFilter );
  
  useEffect(() => {
    //na svaku promjenu filter state varijable, spremi tu novu vrijednost u sessionStorage pod key "filter"
    sessionStorage.setItem('filter', JSON.stringify(filter));
  }, [filter]);
  
  const [filteredAndSortedItems, setFilteredAndSortedItems] = useState([]);
  //useEffect() which will be called only when component mounts (and when changing items variable)
  //this is important when we want to go back to "products page" to display filteredAndSorted items (no need to manually filter and sort again)
  useEffect(()=>{
    //filter (all) items according to filter state variable (and also sort that filtered items) and update filteredAndSortedItems
    //state variable which causes call of another useEffect() hook that will end up showing filtered and sorted items
    setFilteredAndSortedItems(filterAndSortItems(items, filter.minPrice, filter.maxPrice, filter.sortBy));
    console.log("useEffect on mounting!");
  }, [items]);
  

  const [filterFormOpen, setFilterFormOpen] = useState(false);

  //currPage is state variable that store active (selected) page
  const [currPage, setCurrPage] = useState(0 || JSON.parse(sessionStorage.getItem('currPage')));
  useEffect(()=>{
    sessionStorage.setItem('currPage', JSON.stringify(currPage));
  },[currPage]);
  // We start with an empty list of items
  const [currentItems, setCurrentItems] = useState([]);
  //pageCount će biti broj stranica koje ćemo odrediti dijeljenjem ukupnog broja itema i broj itema per page (Math.ceil(item.length/itemPerPage))
  const [pageCount, setPageCount] = useState(0);
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  //itemOffset bi trebao biti broj itema koje preskačemo (nakon kojih prikazujemo)
  const [itemOffset, setItemOffset] = useState(0 || JSON.parse(sessionStorage.getItem('itemOffset')));
  useEffect(()=>{
    sessionStorage.setItem('itemOffset', JSON.stringify(itemOffset));
  },[itemOffset]);

  useEffect(() => {
    //endOffset bi trebao biti potencijalno zadnji broj itema kojeg možemo prikazati na toj single page
    const endOffset = itemOffset + itemsPerPage;
    console.log(`Loading items from ${itemOffset+1} to ${endOffset}`);
    setCurrentItems(filteredAndSortedItems.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(filteredAndSortedItems.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, filteredAndSortedItems]);

  function handleOnLoad(){
    if(JSON.parse(sessionStorage.getItem('scrollPositionY'))){
      window.scrollTo(0, sessionStorage.getItem('scrollPositionY'));
      sessionStorage.removeItem('scrollPositionY');
    }
  }

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % filteredAndSortedItems.length;
    console.log(`User requested page number ${event.selected+1}, which is offset ${newOffset}`);
    setCurrPage(event.selected);
    setItemOffset(newOffset);
  };

  //filter all items according to filter state variable (and also sort that filtered items) then update filteredAndSortedItems state variable
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setItemOffset(0);
    setCurrPage(0);
    setFilterFormOpen(false);
    setFilteredAndSortedItems(filterAndSortItems(items, filter.minPrice, filter.maxPrice, filter.sortBy));
  }

  const handleSortChange = (e) => {
    dispatchFilter({type: "sortBy", data: e.target.value});
    //IMPORTANT to send array that points on different address (otherwise, sending filteredAndSortedItems as param means that arr param in sortItem() function will point on the same address so we will mutate state variable manually which will cause bugs)
    //so we will send array [...filteredAndSortedItems] which is array that points on different address but has same values as filteredAndSortedItems array
    //with this aproach we won't mutate state variable filteredAndSortedItems manually and won't cause any bugs
    setFilteredAndSortedItems(sortItems([...filteredAndSortedItems], e.target.value));
  }

  return (
    <div onLoad={handleOnLoad} className={styles.itemsAndPaginateWrapper}>
      <div className={styles.filterBtnAndSortWrapper}>
        <button className={styles.filterOpenBtn} onClick={(e)=>{e.stopPropagation(); setFilterFormOpen(prevFilterFormOpen => !prevFilterFormOpen)}}>{!filterFormOpen ? "Filter" : "Close"}</button>
        <select name="sortBy" id="sortBy" value={filter.sortBy} onChange={(e)=>{handleSortChange(e)}}>
          <option value="" disabled>Sort by:</option>
          <option value="price-inc">Price - increment</option>
          <option value="price-dec">Price - decrement</option>
          <option value="rating">Rating</option>
          <option value="title">Title</option>
        </select>
      </div>
      
      {filterFormOpen &&
        <form action="" onSubmit={(e)=>{handleFilterSubmit(e)}} className={styles.filterForm}>
          <div className={styles.filterContentWrapper}>
            <div className={styles.filterLabelAndInput}>
              <label htmlFor="minPrice" className={styles.filterLabel}>Min price:</label>
              <input type="number" id="minPrice" className={styles.filterInput} value={filter.minPrice} onChange={(e)=>{dispatchFilter({type: "minPrice", data: e.target.value})}}></input>
            </div>
            <div className={styles.filterLabelAndInput}>
              <label htmlFor="maxPrice" className={styles.filterLabel}>Max price:</label>
              <input type="number" id="maxPrice" className={styles.filterInput} value={filter.maxPrice} onChange={(e)=>{dispatchFilter({type: "maxPrice", data: e.target.value})}}></input>
            </div>
            <button type="submit" className={styles.filterSubmitBtn}><span className={styles.filterBtnFront}>Show</span></button>
          </div>
        </form>
      }
      
      
      <Items currentItems={currentItems} />
      <ReactPaginate
        breakLabel="..."
        nextLabel=">"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        forcePage={currPage}
        previousLabel="<"
        renderOnZeroPageCount={null}
        containerClassName={styles.containerClassName}
        pageClassName={styles.pageClassName}
        pageLinkClassName={styles.pageLinkClassName}
        activeClassName={styles.activeClassName}
        activeLinkClassName={styles.activeLinkClassName}
        previousClassName={styles.previousClassName}
        previousLinkClassName={styles.previousLinkClassName}
        nextClassName={styles.nextClassName}
        nextLinkClassName={styles.nextLinkClassName}
        disabledClassName={styles.disabledClassName}
        disabledLinkClassName={styles.disabledLinkClassName}
      />
    </div>
  );
}

export default PaginatedItems;