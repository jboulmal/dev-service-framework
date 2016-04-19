/*
 * generated by Xtext
 */
package rethink.uml.serializer;

import com.google.inject.Inject;
import com.google.inject.Provider;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.xtext.serializer.acceptor.ISemanticSequenceAcceptor;
import org.eclipse.xtext.serializer.diagnostic.ISemanticSequencerDiagnosticProvider;
import org.eclipse.xtext.serializer.diagnostic.ISerializationDiagnostic.Acceptor;
import org.eclipse.xtext.serializer.sequencer.AbstractDelegatingSemanticSequencer;
import org.eclipse.xtext.serializer.sequencer.GenericSequencer;
import org.eclipse.xtext.serializer.sequencer.ISemanticSequencer;
import org.eclipse.xtext.serializer.sequencer.ITransientValueService;
import rethink.uml.classDiagram.CPackage;
import rethink.uml.classDiagram.ClassDiagramPackage;
import rethink.uml.classDiagram.Clazz;
import rethink.uml.classDiagram.DataType;
import rethink.uml.classDiagram.DomainModel;
import rethink.uml.classDiagram.EntityList;
import rethink.uml.classDiagram.Enumer;
import rethink.uml.classDiagram.Note;
import rethink.uml.classDiagram.Property;
import rethink.uml.classDiagram.Relation;
import rethink.uml.classDiagram.RelationParse;
import rethink.uml.classDiagram.RelationType;
import rethink.uml.services.ClassDiagramGrammarAccess;

@SuppressWarnings("all")
public class ClassDiagramSemanticSequencer extends AbstractDelegatingSemanticSequencer {

	@Inject
	private ClassDiagramGrammarAccess grammarAccess;
	
	@Override
	public void createSequence(EObject context, EObject semanticObject) {
		if(semanticObject.eClass().getEPackage() == ClassDiagramPackage.eINSTANCE) switch(semanticObject.eClass().getClassifierID()) {
			case ClassDiagramPackage.CPACKAGE:
				sequence_CPackage(context, (CPackage) semanticObject); 
				return; 
			case ClassDiagramPackage.CLAZZ:
				sequence_Clazz(context, (Clazz) semanticObject); 
				return; 
			case ClassDiagramPackage.DATA_TYPE:
				sequence_DataType(context, (DataType) semanticObject); 
				return; 
			case ClassDiagramPackage.DOMAIN_MODEL:
				sequence_DomainModel(context, (DomainModel) semanticObject); 
				return; 
			case ClassDiagramPackage.ENTITY_LIST:
				sequence_EntityList(context, (EntityList) semanticObject); 
				return; 
			case ClassDiagramPackage.ENUMER:
				sequence_Enumer(context, (Enumer) semanticObject); 
				return; 
			case ClassDiagramPackage.NOTE:
				sequence_Note(context, (Note) semanticObject); 
				return; 
			case ClassDiagramPackage.PROPERTY:
				sequence_Property(context, (Property) semanticObject); 
				return; 
			case ClassDiagramPackage.RELATION:
				sequence_Relation(context, (Relation) semanticObject); 
				return; 
			case ClassDiagramPackage.RELATION_PARSE:
				sequence_RelationParse(context, (RelationParse) semanticObject); 
				return; 
			case ClassDiagramPackage.RELATION_TYPE:
				sequence_RelationType(context, (RelationType) semanticObject); 
				return; 
			}
		if (errorAcceptor != null) errorAcceptor.accept(diagnosticProvider.createInvalidContextOrTypeDiagnostic(semanticObject, context));
	}
	
	/**
	 * Constraint:
	 *     (name=QualifiedName style=PackageStyle? elements+=Element*)
	 */
	protected void sequence_CPackage(EObject context, CPackage semanticObject) {
		genericSequencer.createSequence(context, semanticObject);
	}
	
	
	/**
	 * Constraint:
	 *     (name=ID stereotype=Text? properties+=Property*)
	 */
	protected void sequence_Clazz(EObject context, Clazz semanticObject) {
		genericSequencer.createSequence(context, semanticObject);
	}
	
	
	/**
	 * Constraint:
	 *     ((native=NativeType | entity=[Entity|QualifiedName]) isArray?='[]'?)
	 */
	protected void sequence_DataType(EObject context, DataType semanticObject) {
		genericSequencer.createSequence(context, semanticObject);
	}
	
	
	/**
	 * Constraint:
	 *     (file=STRING? packages+=CPackage+)
	 */
	protected void sequence_DomainModel(EObject context, DomainModel semanticObject) {
		genericSequencer.createSequence(context, semanticObject);
	}
	
	
	/**
	 * Constraint:
	 *     (refs+=[Entity|QualifiedName] refs+=[Entity|QualifiedName]*)
	 */
	protected void sequence_EntityList(EObject context, EntityList semanticObject) {
		genericSequencer.createSequence(context, semanticObject);
	}
	
	
	/**
	 * Constraint:
	 *     (name=ID types+=ID*)
	 */
	protected void sequence_Enumer(EObject context, Enumer semanticObject) {
		genericSequencer.createSequence(context, semanticObject);
	}
	
	
	/**
	 * Constraint:
	 *     ((position=NotePosition value=Text) | (of=[Entity|ID] value=Text) | (name=ID value=Text))
	 */
	protected void sequence_Note(EObject context, Note semanticObject) {
		genericSequencer.createSequence(context, semanticObject);
	}
	
	
	/**
	 * Constraint:
	 *     (name=ID ((optional?='?'? (type=DataType | entityList=EntityList)?) | (constant?='=' value=Text)))
	 */
	protected void sequence_Property(EObject context, Property semanticObject) {
		genericSequencer.createSequence(context, semanticObject);
	}
	
	
	/**
	 * Constraint:
	 *     ((comp=CompType type=RelationType direct?='>'? multi=MULTI?) | (type=RelationType (direct?='>' | ext?='|>')? multi=MULTI?))
	 */
	protected void sequence_RelationParse(EObject context, RelationParse semanticObject) {
		genericSequencer.createSequence(context, semanticObject);
	}
	
	
	/**
	 * Constraint:
	 *     (strong?=StrongRel | weak?=WeakRel)
	 */
	protected void sequence_RelationType(EObject context, RelationType semanticObject) {
		genericSequencer.createSequence(context, semanticObject);
	}
	
	
	/**
	 * Constraint:
	 *     (leftRef=[Node|QualifiedName] relType=RelationParse rightRef=[Node|QualifiedName] name=Text?)
	 */
	protected void sequence_Relation(EObject context, Relation semanticObject) {
		genericSequencer.createSequence(context, semanticObject);
	}
}
