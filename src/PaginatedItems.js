import React, { useEffect, useState, useContext } from 'react';
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

  return (
    <>
      {currentItems && <div className={styles.cardWrapper}>{currentItems.map((item)=>{
        return(
          <div className={styles.card} key={item._id}>
              <Link to={`/products/${item._id}`} className={styles.link} >
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

//main component that receives all data (items) and number of items per page (itemsPerPage) as a props
function PaginatedItems(props) {

  const items = props.data;
  const itemsPerPage = props.itemsPerPage;

  const [filteredItems, setFilteredItems] = useState(items);
  const [filter, setFilter] = useState({minPrice: 0, maxPrice: 32000000});
  const [filterFormOpen, setFilterFormOpen] = useState(false);

  // We start with an empty list of items
  const [currentItems, setCurrentItems] = useState([]);
  //pageCount će biti broj stranica koje ćemo odrediti dijeljenjem ukupnog broja itema i broj itema per page (Math.ceil(item.length/itemPerPage))
  const [pageCount, setPageCount] = useState(0);
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  //itemOffset bi trebao biti broj itema koje preskačemo (nakon kojih prikazujemo)
  const [itemOffset, setItemOffset] = useState(0);

  useEffect(() => {
    //endOffset bi trebao biti potencijalno zadnji broj itema kojeg možemo prikazati na toj single page
    const endOffset = itemOffset + itemsPerPage;
    console.log(`Loading items from ${itemOffset} to ${endOffset}`);
    setCurrentItems(filteredItems.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(filteredItems.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, filteredItems]);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % filteredItems.length;
    console.log(`User requested page number ${event.selected}, which is offset ${newOffset}`);
    setItemOffset(newOffset);
  };

  //filter all items according to filter state variable then update filteredItems state variable
  const filterItems = (e) => {
    e.preventDefault();
    setItemOffset(0);
    setFilterFormOpen(false);
    setFilteredItems(items.filter((item)=>{
      if(item.price >= filter.minPrice && item.price <= filter.maxPrice){
        return true;
      }else{
        return false;
      }
    }));
  }

  return (
    <div className={styles.itemsAndPaginateWrapper}>
      {filterFormOpen ?
        <form action="" onSubmit={(e)=>{filterItems(e)}} className={styles.filterForm}>
          <div>
            <button className={styles.filterCloseBtn} onClick={(e)=>{setFilterFormOpen(false)}}>Close</button>
          </div>
          <div className={styles.filterContentWrapper}>
            <div className={styles.filterLabelAndInput}>
              <label htmlFor="minPrice" className={styles.filterLabel}>Min price:</label>
              <input type="number" id="minPrice" className={styles.filterInput} value={filter.minPrice} onChange={(e)=>{setFilter({...filter, minPrice: parseInt(e.target.value)})}}></input>
            </div>
            <div className={styles.filterLabelAndInput}>
              <label htmlFor="maxPrice" className={styles.filterLabel}>Max price:</label>
              <input type="number" id="maxPrice" className={styles.filterInput} value={filter.maxPrice} onChange={(e)=>{setFilter({...filter, maxPrice: parseInt(e.target.value)})}}></input>
            </div>
            <button type="submit" className={styles.filterSubmitBtn}><span className={styles.filterBtnFront}>Show</span></button>
          </div>
        </form> :
        <button className={styles.filterOpenBtn} onClick={(e)=>{setFilterFormOpen(true)}}>Filter</button>
      }
      
      <Items currentItems={currentItems} />
      <ReactPaginate
        breakLabel="..."
        nextLabel=">"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
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