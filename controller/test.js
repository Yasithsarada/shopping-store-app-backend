exports = async function(changeEvent) {
    try {
      // Destructure out fields from the change stream event object
      const { fullDocument, operationType, documentKey, fullDocumentBeforeChange } = changeEvent;
  
      // Define your service and database names
      const serviceName = "mongodb-atlas";
      const databaseName = "test"; // Replace with your actual database name
  
      // Initialize MongoDB service
      const mongodb = context.services.get("mongodb-atlas");
      if (!mongodb) {
          const productsCollection = mongodb.db("test").collection("products");
          const reviewsCollection =  mongodb.db("test").collection("reviews");
        console.error("Could not access MongoDB service:", serviceName);
        return;
      }
      console.log("Successfully accessed MongoDB service:", serviceName);
   console.log("datab name:", databaseName);
      // Initialize database
      // const db = mongodb.db("test");
      // if (!mongodb.db("test")) {
      //   console.error("Could not access database:", databaseName);
      //   return;
      // }
      // console.log("Successfully accessed database:", databaseName);
      // Initialize collections
      if (!productsCollection || !reviewsCollection) {
        console.error("Could not access collections");
        return;
      }
      console.log("Successfully accessed collections");
  
      let productId;
  
      // Handle different operation types
      if (operationType === "insert") {
        productId = fullDocument.productId;
      } else if (operationType === "update" || operationType === "replace") {
        const updatedReview = await reviewsCollection.findOne({ _id: documentKey._id });
        if (!updatedReview) {
          console.error("Could not find updated review with ID:", documentKey._id);
          return;
        }
        productId = updatedReview.productId;
      } else if (operationType === "delete") {
        productId = fullDocumentBeforeChange.productId;
      }
  
      if (!productId) {
        console.error("Product ID not found for operation:", operationType);
        return;
      }
  
      // Fetch all reviews for the given product
      const reviews = await reviewsCollection.find({ productId: productId }).toArray();
      if (!reviews) {
        console.error("Could not fetch reviews for product ID:", productId);
        return;
      }
  
      // Calculate the new average rating
      const totalRatings = reviews.reduce((acc, review) => acc + review.rating, 0);
      let averageRating = (totalRatings + 5.0) / (reviews.length + 1);
  
      if (averageRating > 5.0) {
        averageRating = 5.0;
      }
  
      // Update the average rating in the product document
      const updateResult = await productsCollection.updateOne(
        { _id: productId },
        { $set: { averageRating: averageRating } }
      );
  
      if (!updateResult.matchedCount) {
        console.error("Could not find product with ID:", productId);
      } else if (!updateResult.modifiedCount) {
        console.error("Failed to update product with ID:", productId);
      } else {
        console.log("Successfully updated product with ID:", productId);
      }
  
    } catch (err) {
      console.error("Error processing change event:", err.message);
    }
  };
  
  
  