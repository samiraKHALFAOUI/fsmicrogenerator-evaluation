FROM mongo

WORKDIR /app

COPY . .

# Make the wrapper script executable
RUN chmod +x restoredb.sh 
#\
#    && chmod +x ./db_caracteristiqueService/script.sh \
#    && chmod +x ./db_elementProjetService/script.sh \
#    && chmod +x ./db_membreService/script.sh \
#    && chmod +x ./db_taxonomieService/script.sh

CMD ["./restoredb.sh"]