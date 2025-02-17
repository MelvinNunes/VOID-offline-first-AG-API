-- CreateTable
CREATE TABLE "components" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "compositeId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "created_at" TIMESTAMP NOT NULL,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "components_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "components_compositeId_productId_key" ON "components"("compositeId", "productId");

-- AddForeignKey
ALTER TABLE "components" ADD CONSTRAINT "components_compositeId_fkey" FOREIGN KEY ("compositeId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "components" ADD CONSTRAINT "components_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
