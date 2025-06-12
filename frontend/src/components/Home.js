import React from 'react';

export default function Home() {
  return (
    <>
    <div className="d-flex justify-content-center flex-wrap gap-3">
      <div className="card" style={{ width: '18rem' }}>
         <img src="/img.jpg" className="card-img-top" alt="vfff" />
         <div class="card-body">
         <h5 className="card-title">Card title</h5>
         <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card’s content.</p>
         <a href="/" class="btn btn-primary">Feedback</a>
         </div>
      </div>   

      <div className="card" style={{ width: '18rem' }}>
         <img src="/img.jpg" className="card-img-top" alt="vfff" />
         <div class="card-body">
         <h5 className="card-title">Card title</h5>
         <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card’s content.</p>
         <a href="/" class="btn btn-primary">Feedback</a>
         </div>
      </div> 
      <div className="card" style={{ width: '18rem' }}>
         <img src="/img.jpg" className="card-img-top" alt="vfff" />
         <div class="card-body">
         <h5 className="card-title">Card title</h5>
         <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card’s content.</p>
         <a href="/" class="btn btn-primary">Feedback</a>
         </div>
      </div>    
      </div>

    </>
  );
}
